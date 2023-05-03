"use strict";

import Express	from "express";
import cheerio	from "cheerio";

const MC_API_URL 			= "https://api.mojang.com/users/profiles/minecraft/";
const NAMEMC_PROFILE_PAGE	= "https://namemc.com/profile/";

const router = Express.Router();

router.get("/namemc", async (req, res) => {
	const username = req.query["username"];

	if (typeof username !== "string") {
		return res.json({error: "what in sh33p's name are ya up to? :P"})
	}

	const uuid = await (await fetch(MC_API_URL + username)).json();

	return res.json({
		nameHistory: await scrapeNameHistory(uuid)
	});
});

async function scrapeNameHistory(uuid: string) {
	const namemcProfile = await (await fetch(NAMEMC_PROFILE_PAGE + uuid)).text();
	console.log(namemcProfile);
	const $ = cheerio.load(namemcProfile);

	// the big boi container "card mb-3"
	const bigContainer = $(`span:contains("Name History")`).parent().parent();

	// the place where all the <tr>s are dumped into ;-;
	const tbody = bigContainer.find(".card-body").find("table").find("tbody");
	const trElements = tbody.children("tr");

	const res: [string, string][] = [];

	console.log({
		f: bigContainer,
	})

	for (let i = 0; i < trElements.length; i += 2) {
		const el = trElements[i];
		const name = el.type;
		res.push([name, name]);
	}

	return res;
}

export default router;
