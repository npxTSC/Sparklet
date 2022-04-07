import {io}	from "socket.io-client";
const socket = io();

const RIDElement	= (document.getElementById("RID-input") as HTMLInputElement);
const loginForm		= document.getElementById("quizLoginForm");

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (RIDElement.value) {
		socket.emit("queryRoom", RIDElement.value);
	}
});

