"use strict";

import Express					from "express";
import {lookupUUID, NameMCUser}	from "namemc";

const MC_API_URL 			= "https://api.mojang.com/users/profiles/minecraft/";

const router = Express.Router();

router.get("/namemc", async (req, res) => {
	const username = req.query["username"];

	if (typeof username !== "string") {
		return res.json({error: "what in sh33p's name are ya up to? :P"})
	}

	const uuid = (await (await fetch(MC_API_URL + username)).json())["id"];

	return res.json({
		nameHistory: await getNameHistory(uuid)
	});
});

async function getNameHistory(uuid: string) {
	const user: NameMCUser = await lookupUUID(uuid);

	// Log user to console
	console.log(user);

	const res: [string, string][] = [];

	user.pastNames.forEach(v => {
		res.push([v.name, v.changedAt?.toString() ?? "[unknown]"]);
	})

	return res;
}

export default router;
