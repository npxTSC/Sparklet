"use strict";

import {rand, elem, str}		from "libdx";
import {Howl, Howler}			from "howler";
import Cloudy					from "./vsts/cloudy";
import RePlay					from "./vsts/replay";
import {
	Sample,	Rhythm,
	VST, theme
}	from "./classes";

// Web prep stuff
const {setInterval} = window;
const ctx			= new AudioContext();
const testSample	= new Sample();
const canvas		= <HTMLCanvasElement> document.getElementById("mainCanvas");
const c				= canvas.getContext("2d");
const FPS			= 60;

export const SYNTH_BORDERS			= 4;
export const SYNTH_TITLEBAR_HEIGHT	= 20;
const activeVSTs: VST[]	= [];

let mouseX: number;
let mouseY: number;
let mouseDown = false;


window.addEventListener("resize", resizeHandler);
resizeHandler();

// For debug, start out with 1 pre-initialized Cloudy eVST
activeVSTs.push(new Cloudy(ctx));
//activeVSTs.push(new RePlay(ctx));

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then((midi) => {
		// Success
		const {inputs, outputs} = midi;

		inputs.forEach((input) => {
			input.onmidimessage = midiMessageHandler;
		});
	}, () => {
		// Error
		console.error("There was a problem loading a MIDI device.");
	});
}

function midiMessageHandler(message: WebMidi.MIDIMessageEvent) {
	const [command, note, velocity] = message.data;
	
	for (const instance of activeVSTs) {
		if (!instance.acceptsMidiInput) continue;
		
		instance.onMidiInput(command, note, velocity);
	}
}


function drawLoop() {
	// Clear canvas
	c.clearRect(0, 0, canvas.width, canvas.height);

	// Draw background
	c.fillStyle = theme.BACKGROUND;
	c.fillRect(0, 0, innerWidth, innerHeight);
	
	// Draw title bar
	c.fillStyle = theme.TITLEBAR;
	c.fillRect(0, 0, innerWidth, 40);

	// Draw open instance GUIs
	for (const instance of activeVSTs) {
		if (!instance.visible) continue;
		
		c.fillStyle = theme.VST_BACKGROUND;
		c.fillRect(	instance.x, instance.y,
					instance.w, instance.h	);
		
		c.fillStyle = theme.VST_EMPTY;
		c.fillRect(	instance.x+SYNTH_BORDERS,
					instance.y+SYNTH_BORDERS,
					instance.w-(SYNTH_BORDERS*2),
					instance.h-(SYNTH_BORDERS*2)	);

		instance.draw(c);

		c.fillStyle = theme.VST_TITLEBAR;
		c.fillRect(instance.x, instance.y, instance.w, SYNTH_TITLEBAR_HEIGHT);
	}
}

canvas.addEventListener("mousemove", (e) => {
	const rect	= canvas.getBoundingClientRect();
	const mx = e.clientX - rect.left;
	const my = e.clientY - rect.top;

	for (const instance of activeVSTs) {
		if (!instance.isBeingDragged) continue;
		instance.x += (mx-mouseX);
		instance.y += (my-mouseY);
		instance.updateDisplay();
	}
	
	[mouseX, mouseY] = [mx, my];
});

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true;
	
	for (const instance of activeVSTs) {
		if (!instance.visible) continue;

		if (pointInsideRect(mouseX, mouseY,
			instance.x, instance.y,	instance.w, 20)) {
			
			instance.isBeingDragged = true;
		}
	}
});

canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;

	for (const instance of activeVSTs) {
		instance.isBeingDragged = false;
	}
});

setInterval(drawLoop, FPS/1000);










// Set canvas dimensions
function resizeHandler() {
	canvas.width	= innerWidth;
	canvas.height	= innerHeight;
}

function pointInsideRect(	x: number,	y: number,
							rx: number,	ry: number,
							rw: number,	rh: number,	) {
	return	((x>=rx) && (x<rx+rw)) &&
			((y>=ry) && (y<ry+rh));
}

// Get frequency in hertz from MIDI note value
export function noteHz(note: number) {
	return (440 / 32) * (2 ** ((note - 9) / 12));
}
