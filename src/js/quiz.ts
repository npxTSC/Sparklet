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

const joinModalE	= document.getElementById("joinModal");
const joinModal		= new Modal(joinModalE);

const joinCarouselE	= document.getElementById("joinCarousel");
const joinCarousel	= new Carousel(joinCarouselE);

const joinCodeSlide	= document.getElementById("joinCodeSlide");

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
	joinModal.show();
	joinModalE.addEventListener("hidden.bs.modal",
		function shakeAfterClose() {
			joinModalE.removeEventListener(
				"hidden.bs.modal",
				shakeAfterClose
			);

			shakeElement(RIDElement, 750, 5);
		}
	);
});

socket.on("quizFound", () => {
	joinCodeSlide.style.animation = "fadeOut 500ms normal forwards";
	setTimeout(() => {
		joinCarousel.to(1);
	}, 500);
});