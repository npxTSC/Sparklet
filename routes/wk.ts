"use strict";

import Express from "express";
import { GITHUB_PAGE } from "../consts.js";

const router = Express.Router();

// Well-known URIs
router.get("/.well-known/change-password", (_, res) => {
    res.redirect("/login");
});

router.get("/security.txt", (_, res) => {
    res.redirect(`${GITHUB_PAGE}/blob/master/SECURITY.md`);
});

export default router;
