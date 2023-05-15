"use strict";

import {
	AdminRank, SparkletDB, Nullable
}						from "../classes.js";
import Express			from "express";
import db				from "../db.js";
import { UploadedFile }	from "express-fileupload";

const router = Express.Router();

router.get("/wipe-users", async (req, res) => {
	await defaultCheck(res, AdminRank.Operator, async () => {
		await db.admin.lmfao();
		res.send("Done...");
	});
});

router.post("/new-spark", async (req, res) => {
	await defaultCheck(res, AdminRank.Manager, async () => {
		const {sparkTitle, sparkDesc} = req.body;
		
		if (!sparkTitle || !sparkDesc)
			return res.status(400).send("Form incomplete");

		if (!req.files)
			return res.status(400).send("No file uploaded");
		
		const sparkZip = req.files["spark"] as UploadedFile;

		if (!sparkZip)
			return res.status(400).send("File `spark` not uploaded!");
		
		const acc = res.locals.account as SparkletDB.SparkletUser;

		const spark = await db.admin.postSpark(
			sparkTitle,
			acc.uuid,
			sparkDesc
		);

		if (sparkZip.mimetype !== "application/zip") {
			return res.status(400).send("Uploaded file is not a zip file");
		}

		// extract spark zip

		return res.redirect("/sparks");
	});
});

// TODO: make this use async stuff instead of callback fn
async function defaultCheck(
	res:		Express.Response,
	rank:		AdminRank,
	ifPassed:	() => any,
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
	res:	Express.Response,
	rank:	AdminRank
): Nullable<boolean> {
	if (res.locals.account === null) return null;

	const acc = res.locals.account as SparkletDB.SparkletUser;
	return (acc.adminRank >= rank);
}

export default router;
