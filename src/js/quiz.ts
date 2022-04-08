import {filterStringE,
		shakeElement}	from "../../util";
import {io}				from "socket.io-client";
const socket = io();

const loginForm		= document.getElementById("quizLoginForm");
const RIDElement	=
	<HTMLInputElement> document.getElementById("RID-input");

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (RIDElement.value) {
		socket.send("query room", RIDElement.value);
		console.log("Emitted");
	}
});

RIDElement.addEventListener("input", () => {
	RIDElement.value = filterStringE(
		RIDElement.value,
		["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	);
});

socket.on("quiz not found", () => {
	console.log("NF");
	alert("not found");
	shakeElement(RIDElement, 50, 10);
});

socket.on("quiz found", () => {
	console.log("F");
	alert("found");
//	shakeElement(RIDElement, 50, 10);
});
