// Actual quiz code (live game)
"use strict";

import {str, cmon, elem}	from "libdx";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const {
	quizToken:	QPLAY_TOKEN,
	jrStatus:	ROOM_STATUS_AT_JOIN = "???"
} = cmon.parse(document.cookie);

// If no cookie
if (ROOM_STATUS_AT_JOIN !== "???") {
	document.cookie = cmon.remove("jrStatus", "/");
}

//
if (ROOM_STATUS_AT_JOIN === "waiting") {
	showWaitingScreen();
}

function showWaitingScreen() {
	document.getElementById("");
}

socket.on("connect", () => {
	console.log("Connected to Socket.IO");
});
