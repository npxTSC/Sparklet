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
		socket.send("queryQuizRoom", RIDElement.value);
		console.log("Emitted " + RIDElement.value);
	}
});

RIDElement.addEventListener("input", () => {
	RIDElement.value = filterStringE(
		RIDElement.value,
		["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	);
});

socket.on("quizNotFound", (e) => {
	console.log("NF");
	alert("not found");
	shakeElement(RIDElement, 50, 10);
});

socket.on("quizFound", (e) => {
	console.log("F");
	alert("found");
//	shakeElement(RIDElement, 50, 10);
});
