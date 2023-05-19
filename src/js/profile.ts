/*
* Runs on the profile page
* Used for stuff like editing your own profile
*/
"use strict";

import {sleep$, post$, elem}	from "libdx";
import {SparkletDB}				from "../../classes.js";
import {BIO_CHAR_LIMIT}			from "../../consts.js";

// if there's one more "delay" const like this,
// then it should prob be refactored
const BIO_CHECK_DELAY = 2000;

const profileInfo = (window as any).profileInfo as SparkletDB.SparkletUser;

const bioE = document.getElementsByClassName("profile-bio")[0] as HTMLParagraphElement;

const profileUUID = profileInfo.uuid;
const ownProfile = profileUUID === currentAccount.uuid;
console.log(`This is ${ownProfile ? "" : "not "}your profile.`);

if (ownProfile) {
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
			submitNewBio(profileUUID, bioE.innerText);
		}
	});

	bioE.addEventListener("keydown", async (e) => {
		if (!(e.key === "Enter" && e.ctrlKey)) return;

		// If ctrl + enter, submit
		e.preventDefault();
		bioE.blur();
		editCounter = 0;
		submitNewBio(profileUUID, bioE.innerText);
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
