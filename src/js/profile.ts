/*
* Runs on the profile page
* Used for stuff like editing your own profile
*/
"use strict";

import {sleep$, post$, elem}	from "libdx";
import {SparkletDB}				from "../../classes.js";

// if there's one more "delay" const like this,
// then it should prob be refactored
const BIO_CHECK_DELAY = 2000;

const profileInfo = (window as any).profileInfo as SparkletDB.SparkletUser;

const bioE = document.getElementsByClassName("profile-bio")[0] as HTMLParagraphElement;

const ownProfile = profileInfo.uuid === currentAccount.uuid;
console.log(`This is ${ownProfile ? "" : "not "}your profile.`);

if (ownProfile) {
	bioE.setAttribute("contenteditable", "true");
	bioE.addEventListener("change", () => {
		const oldBio = bioE.innerText;

		sleep$(BIO_CHECK_DELAY);

		// if not changed after delay, update it
		if (bioE.innerText === oldBio) {
			submitNewBio(oldBio);
		}
	});
}

function submitNewBio(newBio: string) {
	post$("/profile-mod/bio", {
		newBio
	});

	elem.shakeElement(bioE, 100, 5);
}
