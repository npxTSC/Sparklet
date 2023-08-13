// Quiz page code
"use strict";

import { cmon, elem, str } from "libdx";
import { io } from "socket.io-client";
import { Carousel, Modal } from "bootstrap";
import loaders from "./imports/loaders";

const currentAccount = loaders.account();

const socket = io();

const loginForm = document.getElementById("quizLoginForm")!;
const RIDElement = <HTMLInputElement> document.getElementById("RID-input")!;
const unameElement = <HTMLInputElement> document.getElementById(
  "username-input",
)!;

const joinModalE = document.getElementById("joinModal")!;
const joinModal = new Modal(joinModalE);

const joinCarouselE = document.getElementById("joinCarousel")!;
const joinCarousel = new Carousel(joinCarouselE);

const joinCodeSlide = document.getElementById("joinCodeSlide")!;
const usernameSlide = document.getElementById("usernameSlide")!;
const submitButton = document.getElementById("quizJoinSubmit")!;

let phase = "entering join code";
let lastEnteredRID: string | null = null;

RIDElement.focus();

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
        socket.emit("joinRoom", {
          username: unameElement.value,
          account: currentAccount,
          roomcode: lastEnteredRID,
        });

        phase = "loading in";

        usernameSlide.style.animation = "fadeOut 500ms normal forwards";
        submitButton.style.animation = "fadeOut 500ms normal forwards";

        setTimeout(() => {
          joinCarousel.to(2);
        }, 500);

        setTimeout(() => {
          document.getElementById("slowInternetWarning")!
            .classList.remove("invisible");
        }, 15000);
      }
      break;
  }
});

const ROOMCODE_CHARS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
RIDElement.addEventListener("input", () => {
  RIDElement.value = str.filterStringE(
    RIDElement.value.toUpperCase(),
    ROOMCODE_CHARS,
  );
});

socket.on("quizNotFound", () => errorModalHandler());
socket.on("quizNotFound on step 2", () => errorModalHandler());

socket.on("quizFound", () => {
  joinCodeSlide.style.animation = "fadeOut 500ms normal forwards";
  setTimeout(() => {
    joinCarousel.to(1);
    setTimeout(() => {
      unameElement.focus();
    }, 1000);
  }, 500);
  phase = "entering username";
});

socket.on("joinRoomSuccess", (data) => {
  document.cookie = cmon.assignment("quizToken", data.quizToken);
  window.location.href = "/rooms/quiz/" + lastEnteredRID;
});

function errorModalHandler() {
  joinModal.show();
  joinModalE.addEventListener("hidden.bs.modal", function shakeAfterClose() {
    joinModalE.removeEventListener(
      "hidden.bs.modal",
      shakeAfterClose,
    );

    elem.shakeElement(RIDElement, 750, 5);
  });
}
