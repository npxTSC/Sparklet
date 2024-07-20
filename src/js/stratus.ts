// Stratus client-side code
"use strict";

import { io } from "socket.io-client";
import { Modal } from "bootstrap";
import loaders from "./imports/loaders";

const currentAccount = loaders.account();
const socket = io();

const nagModalE = document.getElementById("loginNagModal")!;
const nagModal = new Modal(nagModalE);

if (!currentAccount) {
    nagModal.show();
    nagModalE.addEventListener("hidden.bs.modal", () => {
        window.location.href = "/login";
    });
}

socket.on("connect", () => {
    console.log("Connected to Socket.IO");
});
