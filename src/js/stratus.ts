// Stratus client-side code
"use strict";

import {str, cmon, elem}	from "libdx";
import {io}					from "socket.io-client";
import {Modal, Carousel}	from "bootstrap";
const socket = io();

const nagModalE	= document.getElementById("loginNagModal")!;
const nagModal	= new Modal(nagModalE);

if (!currentAccount) {
	nagModal.show();
	nagModalE.addEventListener("hidden.bs.modal", () => {
		window.location.href = "/login";
	});
}

socket.on("connect", () => {
	console.log("Connected to Socket.IO");
});
