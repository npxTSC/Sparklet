// Control panel page for quizes
"use strict";

import { cmon } from "libdx";
import { io } from "socket.io-client";
import { QuizHostResponse, QuizPlayer } from "../../classes";

const socket = io();
const ROOM_CODE = location.pathname.split("/")[2];
const ROOM_AUTH = cmon.read(document.cookie, "qhostAuthToken");

document.getElementById("joincode")!.innerText = `Quiz Control (${ROOM_CODE})`;

// Elements
const CLI = document.getElementById("quizHostCLI") as HTMLInputElement;
const resultsbox = document.getElementById("results") as HTMLDivElement;
const listingsDiv = document.getElementById("listings") as HTMLDivElement;
const noResultsE = document.getElementById("noresults") as HTMLDivElement;

let players: QuizPlayer[] = [];

const listingBlueprint = resultsbox.lastElementChild as HTMLDivElement;
async function makePlayerE(player: QuizPlayer): Promise<HTMLDivElement> {
  const el = <HTMLDivElement> listingBlueprint.cloneNode(true);
  el.style.display = "flex";

  const { username, account, tempToken, uuid } = player;

  // Title
  (<HTMLParagraphElement> el.children[0].children[0])
    .innerText = username;

  (<HTMLParagraphElement> el.children[0].children[1])
    .innerText = player.account
      ? `Account: ${player.account.name} (${player.account.uuid})`
      : "// No Account";

  // UUID
  (<HTMLAnchorElement> el.children[1].children[0])
    .addEventListener("click", () => {
      CLI.value += uuid;
      CLI.focus();
      CLI.setSelectionRange(CLI.value.length, CLI.value.length);
    });

  // Ban
  (<HTMLAnchorElement> el.children[1].children[1])
    .addEventListener("click", () => kickPlayer(player));

  return el;
}

async function kickPlayer(pl: QuizPlayer) {
  runCommand(`ban:${pl.uuid}`);
}

async function updatePlayers(plys: QuizPlayer[]) {
  // Clear previous results
  listingsDiv.innerHTML = "";

  if (plys.length > 0) {
    // Hide "no results" widget
    noResultsE.style.display = "none";

    // Show results
    for (let ply of plys) {
      listingsDiv.appendChild(await makePlayerE(ply));
    }
  } else {
    // Show "no results" widget
    noResultsE.style.display = "block";
  }
}

socket.on("connect", () => {
  console.log("Connected to Socket.IO");
  runCommand("getPlayers");
});

socket.on("quizHostResponse", (res: QuizHostResponse) => {
  if (res.alert) alert(res.alert);

  if (res.players) {
    players = res.players;
    updatePlayers(players);
  }
});

CLI.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    runCommand(CLI.value);

    // Clear CLI
    CLI.value = "";
  }
});

function runCommand(v: string) {
  socket.emit("quizHostAction", {
    room: ROOM_CODE,
    auth: ROOM_AUTH,
    cmd: v,
  });
}

// Polling,,, yuck! (Fix this later)
setInterval(() => runCommand("getPlayers"), 5000);
