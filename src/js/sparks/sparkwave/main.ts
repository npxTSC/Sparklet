"use strict";

import {rand, elem, str}		from "libdx";
import {Howl, Howler}			from "howler";
import Cloudy					from "./vsts/cloudy";
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

const activeVSTs: VST[]	= [];

let mouseX: number;
let mouseY: number;
let mouseDown = false;


window.addEventListener("resize", resizeHandler);
resizeHandler();

// For debug, start out with 1 pre-initialized Cloudy eVST
activeVSTs.push(new Cloudy());

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then((midi) => {
		// Success
		const {inputs, outputs} = midi;

		for (const input of inputs.values()) {
			input.onmidimessage = midiMessageHandler;
		}
	}, () => {
		// Error
	});
}

function midiMessageHandler(message: WebMidi.MIDIMessageEvent) {
	const [command, note, velocity] = message.data;

	switch (command) {
		case 144: // Note ON
			if (velocity > 0) noteOn(note, velocity);
			else noteOff(note);
			break;
			
		case 128: // Note OFF
			noteOff(note);
			break;
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

		instance.draw(c);

		c.fillStyle = theme.VST_TITLEBAR;
		c.fillRect(instance.x, instance.y, instance.w, 20);
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










function noteOn(note: number, velocity: number) {
	//alert(`Played note ${note} at velocity ${velocity}`);

	playSample(testSample);
}

function noteOff(note: number) {
	//
}


function playSample(smp: Sample) {
	const sound = new Howl({
		src:		[smp.src],
		preload:	true,
	});

	sound.play();
	
	sound.on("end", () => {
		sound.unload();
	});
}

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
