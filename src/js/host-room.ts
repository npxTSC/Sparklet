// Control panel page for quizes
"use strict";

import {cmon}	from "libdx";
import {io}		from "socket.io-client";
import {
	Capsule, CapsuleContent, QuizPlayer,
	QuizHostCommand, QuizHostResponse
}	from "../../classes";

const socket = io();
const ROOM_CODE = location.pathname.split("/")[2];
const ROOM_AUTH = cmon.read(document.cookie, "qhostAuthToken");

// Elements
const CLI			= document.getElementById("quizHostCLI")	as HTMLInputElement;
const resultsbox	= document.getElementById("results")		as HTMLDivElement;
const listingsDiv	= document.getElementById("listings")		as HTMLDivElement;
const noResultsE	= document.getElementById("noresults")		as HTMLDivElement;

let players: QuizPlayer[] = [];



const listingBlueprint = resultsbox.lastElementChild as HTMLDivElement;
async function makePlayerE(player: QuizPlayer): Promise<HTMLDivElement> {
	
	const el = <HTMLDivElement>listingBlueprint.cloneNode(true);
	el.style.display = "flex";
	
	const {username, account, tempToken} = player;

	// Title
	(<HTMLParagraphElement> el.children[0].children[0])
		.innerText = username;
	
	(<HTMLParagraphElement> el.children[0].children[1])
		.innerText = "Account: " + "";
	
	(<HTMLAnchorElement> el.children[1].children[0])
		.addEventListener("click", () => kickPlayer(player));
	
	return el;
}

async function kickPlayer(pl: QuizPlayer) {}

async function updatePlayers(plys: QuizPlayer[]) {
	// Clear previous results
	listingsDiv.innerHTML = "";

	if (plys.length > 0) {
		// Hide "no results" widget
		noResultsE.style.display = "none";
		
		// Show results
		for (let ply of plys) {
			listingsDiv.appendChild(await makePlayerE(ply));
		};
	} else {
		// Show "no results" widget
		noResultsE.style.display = "block";
	}
}

socket.on("connect", () => {
	console.log("Connected to Socket.IO");
	
	socket.emit("quizHostAction", {
		room:	ROOM_CODE,
		auth:	ROOM_AUTH,
		cmd:	"getPlayers"
	});
});

socket.on("quizHostResponse", (res: QuizHostResponse) => {
	console.log("Received response");
	
	if (res.alert)		alert(res.alert);
	
	if (res.players) {
		players = res.players;
		updatePlayers(players);
	}
});

CLI.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		socket.emit("quizHostAction", {
			room:	ROOM_CODE,
			auth:	ROOM_AUTH,
			cmd:	CLI.value
		});
		
		// Clear CLI
		CLI.value = "";
	}
});
