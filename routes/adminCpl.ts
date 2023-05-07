"use strict";

import {
	AdminRank, SparkletDB, Option
}				from "../classes.js";
import Express	from "express";
import db		from "../db.js";

const router = Express.Router();

router.get("/wipe-users", async (req, res) => {
	switch (checkHasPerms(res, AdminRank.Operator)) {
		case null:
			// no account
			return res.redirect("/");
		
		case false:
			return res.send("Nice try, clown");

		case true:
			await db.lmfao();
			return res.send("Done...");
	}
});

// Mandatory Access Control permission-checking
function checkHasPerms(
	res:	Express.Response,
	rank:	AdminRank
): Option<boolean> {
	if (res.locals.account === null) return null;

	const acc = res.locals.account as SparkletDB.SparkletUser;
	return (acc.adminRank >= rank);
}

export default router;
