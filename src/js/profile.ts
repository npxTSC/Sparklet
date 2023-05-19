/*
* Runs on the profile page
* Used for stuff like editing your own profile
*/
"use strict";

import {sleep$, post$, elem}	from "libdx";
import {SparkletDB}				from "../../classes.js";

// if there's one more "delay" const like this,
// then it should prob be refactored
const BIO_CHECK_DELAY = 800;

const profileInfo = (window as any).profileInfo as SparkletDB.SparkletUser;

const bioE = document.getElementsByClassName("profile-bio")[0] as HTMLParagraphElement;

const ownProfile = profileInfo.uuid === currentAccount.uuid;
console.log(`This is ${ownProfile ? "" : "not "}your profile.`);

if (ownProfile) {
	bioE.setAttribute("contenteditable", "true");
	bioE.addEventListener("input", async () => {
		const oldBio = bioE.innerText;

		await sleep$(BIO_CHECK_DELAY);

		// if not changed after delay, update it
		if (bioE.innerText === oldBio) {
			submitNewBio(oldBio);
		}
	});
}

async function submitNewBio(newBio: string) {
	const req = await post$("/api/profile-mod/bio", {
		newBio
	});

	if (req.status !== 200) {
		console.error("Failed to update bio...");
		return;
	}

	elem.shakeElement(bioE, 100, 5);
	alert("submitted");
}
