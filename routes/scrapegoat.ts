"use strict";

import Express					from "express";

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
	return [["Currently Broken... Use this >>", `https://namemc.com/profile/${uuid}`]];
}

export default router;
