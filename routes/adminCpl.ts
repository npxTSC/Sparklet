"use strict";

import Express from "express";
import fs from "fs";
import path from "path";
import yauzl from "yauzl";
import { UploadedFile } from "express-fileupload";

import { AdminRank, Option } from "../classes.js";
import db from "../db.js";
import { SPARKS_FOLDER } from "../paths.js";

const router = Express.Router();
const ZIP_MIMETYPES = [
    "application/zip",
    "application/x-zip-compressed",
];

router.get("/", async (_, res) => {
    await defaultCheck(res, AdminRank.Electrician, async () => {
        res.render("admin-cpl");
    });
});

router.post("/wipe-users", async (_, res) => {
    await defaultCheck(res, AdminRank.Operator, async () => {
        await db.admin.lmfao();
        res.send("Done...");
    });
});

router.post("/new-spark", async (req, res) => {
    await defaultCheck(res, AdminRank.Manager, async () => {
        const { sparkTitle, sparkDesc } = req.body;

        if (!sparkTitle || !sparkDesc) {
            return res.status(400).send("Form incomplete");
        }

        if (!req.files) {
            return res.status(400).send("No file uploaded");
        }

        const sparkZip = req.files["sparkZip"] as UploadedFile;

        if (!sparkZip) {
            return res.status(400).send("File `spark` not uploaded!");
        }

        const acc = res.locals.account;

        const spark: any = await db.admin.postSpark(
            sparkTitle,
            acc.uuid,
            sparkDesc,
        );

        if (!ZIP_MIMETYPES.includes(sparkZip.mimetype)) {
            return res.status(400).send("Uploaded file is not a zip file");
        }

        // extract spark zip
        const zip: Option<yauzl.ZipFile> = await new Promise(
            (resolve, _) => {
                yauzl.fromBuffer(
                    sparkZip.data,
                    { lazyEntries: true },
                    (err, zip) => resolve(err ? null : zip),
                );
            },
        );

        if (!zip) return res.status(400).send("Error unzipping...");

        zip.readEntry();

        const sparkUUID = spark.uuid;
        zip.on("entry", (entry) => {
            if (/\/$/.test(entry.fileName)) {
                // Directory file names end with "/".
                // We don't need to do anything with these.
                zip.readEntry();
            } else {
                zip.openReadStream(entry, (err, readStream) => {
                    if (err) throw err;

                    const sparkRoute = path.join(SPARKS_FOLDER, sparkUUID);

                    // Create a write stream to write the file contents to disk
                    let fname = (entry.fileName).replace(/\\/g, "/");
                    fname = fname.substring(fname.indexOf("/") + 1);
                    const writePath = `${sparkRoute}/${fname}`;

                    fs.mkdirSync(path.dirname(writePath), { recursive: true });

                    const writeStream = fs.createWriteStream(
                        writePath,
                    );

                    // Pipe the read stream into the write stream to write the file contents to disk
                    readStream.pipe(writeStream);

                    // When the write stream finishes writing, move on to the next entry in the zip file
                    writeStream.on("finish", () => {
                        zip.readEntry();
                    });
                });
            }
        });

        return res.redirect("/sparks");
    });
});

// TODO: make this use async stuff instead of callback fn
async function defaultCheck(
    res: Express.Response,
    rank: AdminRank,
    ifPassed: () => any,
) {
    switch (checkHasPerms(res, rank)) {
        case null:
            // no account
            res.redirect("/login");
            return;

        case false:
            res.send("Nice try, clown");
            return;

        case true:
            return ifPassed();
    }
}

// Mandatory Access Control permission-checking
function checkHasPerms(
    res: Express.Response,
    rank: AdminRank,
): Option<boolean> {
    if (res.locals.account === null) return null;

    const acc = res.locals.account;
    return (acc.adminRank >= rank);
}

export default router;
