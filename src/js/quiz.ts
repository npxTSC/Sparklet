// Quiz page code
"use strict";

import {filterStringE,
	   shakeElement}	from "../../util";
import {io}				from "socket.io-client";
import {Modal}			from "bootstrap";
const socket = io();

const loginForm		= document.getElementById("quizLoginForm");
const RIDElement	=
	<HTMLInputElement> document.getElementById("RID-input");
const errorModalE	= document.getElementById("errorModal");
const errorModal	= new Modal(errorModalE);

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (RIDElement.value) {
		socket.emit("queryRoom", RIDElement.value);
	}
});

RIDElement.addEventListener("input", () => {
	RIDElement.value = filterStringE(
		RIDElement.value,
		["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	);
});

socket.on("quizNotFound", () => {
	errorModal.show();
	errorModalE.addEventListener("hidden.bs.modal",
		function shakeAfterClose() {
			
			errorModalE.removeEventListener(
				"hidden.bs.modal",
				shakeAfterClose
			);

			shakeElement(RIDElement, 500, 10);
		}
	);
});

socket.on("quizFound", () => {
	console.log("F");
	alert("found");
//	shakeElement(RIDElement, 50, 10);
});