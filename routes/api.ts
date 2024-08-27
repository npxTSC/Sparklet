"use strict";

import Express from "express";
import db from "../db.js";
import { AdminRank } from "../classes.js";
import { bioFilter } from "../feutils.js";

const router = Express.Router();
const CHICKEN_WINGS_URL = "https://sparklet.org/public/img/tea-cape.png";

router.get("/tea-capes", (_, res) => {
    // TODO admin portal for changing capes
    res.json({
        "Mira_Serenade": CHICKEN_WINGS_URL,
        "4772c57f-ca43-440c-be84-d5a97b676792": CHICKEN_WINGS_URL,

        "Epsilon094": CHICKEN_WINGS_URL,
        "8a7809c5-8351-4322-8f3f-6b5abce09c81": CHICKEN_WINGS_URL,

        "III_zP0_III": CHICKEN_WINGS_URL,
        "8d5fdde6-9ae9-480b-9cf2-30167933a10e": CHICKEN_WINGS_URL,
    });
});

router.post("/profile-mod/bio", (req, res) => {
    const { newBio, uuid: targetUUID } = req.body;

    if (res.locals.account === null || !newBio) {
        return res.status(400).end();
    }

    const acc = res.locals.account;

    if (acc.uuid !== targetUUID && acc.adminRank < AdminRank.Manager) {
        // must be Manager+ to edit bios of other users
        return res.status(403).end();
    }

    db.updateBio(targetUUID, bioFilter(newBio));

    return res.status(200).end();
});

router.get("/profile", async (req, res) => {
    const { uuid } = req.query;
    if (!uuid) return res.status(400).end();

    const user = await db.getUserByUUID(uuid as string);
    return res.json(user);
});

export default router;
