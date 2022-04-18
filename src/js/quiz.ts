// Quiz page code
"use strict";

import {filterStringE,
	   shakeElement}		from "../../util";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const loginForm		= document.getElementById("quizLoginForm");
const RIDElement	=
	<HTMLInputElement> document.getElementById("RID-input");
const unameElement	=
	<HTMLInputElement> document.getElementById("username-input");

const joinModalE	= document.getElementById("joinModal");
const joinModal		= new Modal(joinModalE);

const joinCarouselE	= document.getElementById("joinCarousel");
const joinCarousel	= new Carousel(joinCarouselE);

const joinCodeSlide	= document.getElementById("joinCodeSlide");



let phase					= "entering join code";
let lastEnteredRID: string	= null;


loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	switch (phase) {
		case "entering join code":
			if (RIDElement.value) {
				lastEnteredRID = RIDElement.value;
				socket.emit("queryRoom", lastEnteredRID);
			}
			break;

		case "entering username":
			if (unameElement.value) {
				const data = JSON.stringify({
					username: unameElement.value,
					roomcode: lastEnteredRID,
				});
				socket.emit("joinRoom", data);
			}
			break;
	}
});

RIDElement.addEventListener("input", () => {
	RIDElement.value = filterStringE(
		RIDElement.value,
		["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	);
});

socket.on("quizNotFound", () => errorModalHandler(RIDElement));

socket.on("quizFound", () => {
	joinCodeSlide.style.animation = "fadeOut 500ms normal forwards";
	setTimeout(() => {
		joinCarousel.to(1);
	}, 500);
	phase = "entering username";
});

socket.on("quizNotFound on step 2", () => errorModalHandler(RIDElement));

function errorModalHandler(shakenElement: HTMLElement) {
	joinModal.show();
	joinModalE.addEventListener("hidden.bs.modal",
		function shakeAfterClose() {
			joinModalE.removeEventListener(
				"hidden.bs.modal",
				shakeAfterClose
			);

			shakeElement(shakenElement, 750, 5);
		}
	);
}
