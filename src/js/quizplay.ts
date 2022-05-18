// Actual quiz code (live game)
"use strict";

import {filterStringE,	cmon,
	   shakeElement}		from "../../util";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const {
	quizToken:	QPLAY_TOKEN,
	jrStatus:	ROOM_STATUS_AT_JOIN = "???"
} = cmon.parse(document.cookie);

// If no cookie
if (ROOM_STATUS_AT_JOIN !== "???") {
	alert(JSON.stringify(cmon.parse(document.cookie)));
	document.cookie = cmon.remove("jrStatus", "/");
	alert(JSON.stringify(cmon.parse(document.cookie)));
}

//
if (ROOM_STATUS_AT_JOIN === "waiting") {
	showWaitingScreen();
}

function showWaitingScreen() {
	document.getElementById("");
}