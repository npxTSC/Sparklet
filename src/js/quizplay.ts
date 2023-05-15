// Actual quiz code (live game)
"use strict";

import {str, cmon, elem}	from "libdx";
import {io}					from "socket.io-client";
const socket = io();

const {
	quizToken:	QPLAY_TOKEN
} = cmon.parse(document.cookie);

let status;

function statusUpdateHandler() {
	//
}

function showWaitingScreen() {
	document.getElementById("");
}

function updateAnswers() {}

socket.on("connect", () => {
	console.log("Connected to Socket.IO");
});

socket.on("updateRoomStatus", (nstatus: string) => {
	status = nstatus;
	statusUpdateHandler();
});

updateAnswers();
