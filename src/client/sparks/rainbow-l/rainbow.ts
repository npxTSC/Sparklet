"use strict";

// consts and initial values
const FONT_SIZE_STEP = 0.1; // in em
const DELTA_CHANGE_STEP = 0.5;
const PHASE_CHANGE_STEP = 10; // in degrees
let t = 0;
let delta = 2;
let fontSize = 8;
let text_phase_shift = 180; // in degrees

// elements that we'll be working with
const body = document.body;
const h1 = document.querySelector("h1");
// h1.focus();

// rainbow tick stuff
function tick() {
    body.style.backgroundColor = `hsl(${t}, 100%, 50%)`;
    h1.style.color = `hsl(${t + text_phase_shift}, 100%, 50%)`;
    t = (t + delta) % 360;
}

setInterval(tick, 30);

// font stuff
applyFontSize();

function applyFontSize() {
    h1.style.fontSize = `${fontSize}em`;
}

document.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) return;

    const shift = event.shiftKey;

    // ctrl + up/down to change font size
    // ctrl + left/right to change rainbow speed
    // ctrl + shift + left/right to change phase shift
    if (event.key === "ArrowUp") {
        fontSize += FONT_SIZE_STEP;
        applyFontSize();
    } else if (event.key === "ArrowDown") {
        fontSize -= FONT_SIZE_STEP;
        applyFontSize();
    } else if (event.key === "ArrowLeft") {
        if (shift) text_phase_shift -= PHASE_CHANGE_STEP;
        else delta -= DELTA_CHANGE_STEP;
    } else if (event.key === "ArrowRight") {
        if (shift) text_phase_shift += PHASE_CHANGE_STEP;
        else delta += DELTA_CHANGE_STEP;
    }
});
