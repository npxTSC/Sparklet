/*
* Runs on the profile page
* Used for stuff like editing your own profile
*/
"use strict";

import {SparkletDB} from "../../classes.js";

const profileInfo = (window as any).profileInfo as SparkletDB.SparkletUser;

const ownProfile = profileInfo.uuid === currentAccount.uuid;
console.log(`This is ${ownProfile ? "" : "not "}your profile.`);
