"use strict";

import {
	AdminRank, SparkletDB, Nullable
}				from	"../classes.js";
import Express	from	"express";
import db		from	"../db.js";

const router = Express.Router();

router.get("/wipe-users", async (req, res) => {
	await defaultCheck(res, AdminRank.Operator, async () => {
		await db.admin.lmfao();
		res.send("Done...");
	});
});

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
