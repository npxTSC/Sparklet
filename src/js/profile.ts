/*
* Runs on the profile page
* Used for stuff like editing your own profile
*/
"use strict";

import {sleep$, post$, elem}	from "libdx";
import {AdminRank, SparkletDB}	from "../../classes.js";
import {BIO_CHAR_LIMIT}			from "../../consts.js";
import loaders					from "./imports/loaders";

const currentAccount	= loaders.account();
const profileInfo		= (
	loaders.profileInfo() ??
	(location.href = "/", null)
)!;

// if there's one more "delay" const like this,
// then it should prob be refactored
const BIO_CHECK_DELAY = 2000;

const bioE = document.getElementsByClassName("profile-bio")[0] as HTMLParagraphElement;

const ownProfile = profileInfo.uuid === currentAccount?.uuid;
console.log(`This is ${ownProfile ? "" : "not "}your profile.`);

// this is also validated server-side... don't worry :) <3
if (ownProfile || currentAccount?.adminRank >= AdminRank.Manager) {
	bioE.setAttribute("contenteditable", "true");

	let editCounter = 0;
	bioE.addEventListener("input", async () => {
		if (bioE.innerText.length > BIO_CHAR_LIMIT) {
			bioE.innerText = bioE.innerText.substring(0, BIO_CHAR_LIMIT);
		}
		
		editCounter++;

		await sleep$(BIO_CHECK_DELAY);
		editCounter--;

		// if was last input in time period, update it
		if (editCounter === 0) {
			bioE.blur();
			submitNewBio(profileInfo.uuid, bioE.innerText);
		}
	});

	bioE.addEventListener("keydown", async (e) => {
		if (!(e.key === "Enter" && e.ctrlKey)) return;

		// If ctrl + enter, submit
		e.preventDefault();
		bioE.blur();
		editCounter = 0;
		submitNewBio(profileInfo.uuid, bioE.innerText);
	});
}

async function submitNewBio(uuid: string, newBio: string) {
	const req = await post$("/api/profile-mod/bio", {
		uuid,
		newBio,
	});

	if (req.status !== 200) {
		console.error("Failed to update bio...");
		return;
	}

	// maybe flash it green or pop up a box saying "submitted" later on
	elem.shakeElement(bioE, 750, 5);
}
