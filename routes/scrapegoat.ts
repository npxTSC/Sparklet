"use strict";

import Express			from "express";
import cheerio			from "cheerio";
import puppeteer		from "puppeteer-extra";
import StealthPlugin	from "puppeteer-extra-plugin-stealth";

const CHROME_EXEC_PATH = "/home/mira/chrome-linux/chrome";

puppeteer.use(StealthPlugin());

const MC_API_URL 			= "https://api.mojang.com/users/profiles/minecraft/";
const NAMEMC_PROFILE_PAGE	= "https://namemc.com/profile/";

const router = Express.Router();

router.get("/namemc", async (req, res) => {
	const username = req.query["username"];

	if (typeof username !== "string") {
		return res.json({error: "what in sh33p's name are ya up to? :P"})
	}

	const uuid = (await (await fetch(MC_API_URL + username)).json())["id"];

	return res.json({
		nameHistory: await scrapeNameHistory(uuid)
	});
});

async function scrapeNameHistory(uuid: string) {
	const browser = await puppeteer.launch({
		headless: false,
		executablePath: CHROME_EXEC_PATH,
		ignoreDefaultArgs: ['--enable-automation'],
	});

	const res: [string, string][] = [];
	
	try {
		const page = await browser.newPage();
		console.log(NAMEMC_PROFILE_PAGE);
		console.log(uuid);
		console.log(NAMEMC_PROFILE_PAGE + uuid);
		await page.goto(NAMEMC_PROFILE_PAGE + uuid, {waitUntil: "domcontentloaded"});
		await new Promise(resolve => setTimeout(resolve, 15000));

		
		const namemcProfile = await page.content();
		console.log(namemcProfile);



		const $ = cheerio.load(namemcProfile);

		// the big boi container "card mb-3"
		const bigContainer = $(`span:contains("Name History")`).parent().parent();

		// the place where all the <tr>s are dumped into ;-;
		const tbody = bigContainer.find(".card-body").find("table").find("tbody");
		const trElements = tbody.children("tr");

		console.log({
			f: bigContainer,
		})

		for (let i = 0; i < trElements.length; i += 2) {
			const el = trElements[i];
			const name = el.type;
			res.push([name, name]);
		}
	} finally {
		// don't forget to close, even if errors out
		await browser.close();
	}

	return res;
}

export default router;
