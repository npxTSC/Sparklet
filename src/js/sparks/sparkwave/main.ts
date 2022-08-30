"use strict";

import {rand, elem, str}		from "libdx";
import {Howl, Howler}			from "howler";
import Cloudy					from "./synths/cloudy";
import RePlay					from "./synths/replay";
import {
	Sample,	Rhythm,
	Synth, theme, SWPlugin
}	from "./classes";

// Constants
export const SYNTH_BORDERS			= 4;
export const SYNTH_TITLEBAR_HEIGHT	= 20;


// Web prep stuff
const {setInterval} = window;

export const octx	= new OfflineAudioContext({
	numberOfChannels: 2,
	length: 44100 * 40,
	sampleRate: 44100,
});

export const ctx	= new AudioContext();
const testSample	= Sample.load();
const canvas		= <HTMLCanvasElement> document.getElementById("mainCanvas");
const c				= canvas.getContext("2d");
const FPS			= 60;


const activePlugins: SWPlugin[]		= [];


let mouseX: number;
let mouseY: number;
let mouseDown = false;


window.addEventListener("resize", resizeHandler);
resizeHandler();


// Debug pre-initialized plugins
activePlugins.push(
	new Cloudy(ctx)
//	new RePlay(ctx)
);

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
	
	for (const instance of activePlugins) {
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
	for (const instance of activePlugins) {
		if (!instance.visible) continue;
		
		c.fillStyle = theme.PLUGIN_BACKGROUND;
		c.fillRect(
			instance.x-SYNTH_BORDERS,
			instance.y-SYNTH_BORDERS,
			instance.w+2*SYNTH_BORDERS,
			instance.h+2*SYNTH_BORDERS
		);
		
		/*c.fillStyle = theme.PLUGIN_EMPTY;
		c.fillRect(	instance.x+SYNTH_BORDERS,
					instance.y+SYNTH_BORDERS,
					instance.w-(SYNTH_BORDERS*2),
					instance.h-(SYNTH_BORDERS*2)	);*/

		instance.draw(c);

		c.fillStyle = theme.PLUGIN_TITLEBAR;
		c.fillRect(instance.x, instance.y, instance.w, SYNTH_TITLEBAR_HEIGHT);
	}
}

canvas.addEventListener("mousemove", (e) => {
	const rect	= canvas.getBoundingClientRect();
	const mx = e.clientX - rect.left;
	const my = e.clientY - rect.top;

	for (const instance of activePlugins) {
		if (!instance.isBeingDragged) continue;
		instance.x += (mx-mouseX);
		instance.y += (my-mouseY);
		instance.updateDisplay();
	}
	
	[mouseX, mouseY] = [mx, my];
});

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true;

	let instancesUnderCursor: SWPlugin[] = [];
	
	for (const instance of activePlugins) {
		if (!instance.visible) continue;

		if (pointWithin(mouseX, mouseY,
			instance.x, instance.y,	instance.w, instance.h)) {
			
			instancesUnderCursor.push(instance);
		}
	}

	//const highestInstance = instancesUnderCursor.sort((a,b) => a.z - b.z)[0];
	const instance = instancesUnderCursor[0];
	if (!instance) return;

	
	// If dragging titlebar
	if (pointWithin(
		mouseX,		mouseY,
		instance.x,	instance.y,
		instance.w,	SYNTH_TITLEBAR_HEIGHT)
	) {
		// Set dragging
		instance.isBeingDragged = true;
	} else {
		// Otherwise, pass control to the plugin
		instance.onClick(mouseX, mouseY);
	}
});

canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;

	for (const instance of activePlugins) {
		instance.isBeingDragged = false;
	}

	let instancesUnderCursor: SWPlugin[] = [];
	
	for (const instance of activePlugins) {
		if (!instance.visible) continue;

		if (pointWithin(mouseX, mouseY,
			instance.x, instance.y,	instance.w, instance.h)) {
			
			instancesUnderCursor.push(instance);
		}
	}

	//const highestInstance = instancesUnderCursor.sort((a,b) => a.z - b.z)[0];
	const instance = instancesUnderCursor[0];
	if (!instance) return;

	
	// If dragging titlebar
	if (pointWithin(
		mouseX,		mouseY,
		instance.x,	instance.y,
		instance.w,	SYNTH_TITLEBAR_HEIGHT)
	) {
		// Set dragging
		instance.isBeingDragged = true;
	} else {
		// Otherwise, pass control to the plugin
		instance.onRelease(mouseX, mouseY);
	}
});

setInterval(drawLoop, FPS/1000);










// Set canvas dimensions
function resizeHandler() {
	canvas.width	= innerWidth;
	canvas.height	= innerHeight;
}

export function pointWithin(x: number,	y: number,
							rx: number,	ry: number,
							rw: number,	rh: number,	) {
	return	((x>=rx) && (x<rx+rw)) &&
			((y>=ry) && (y<ry+rh));
}

// Get frequency in hertz from MIDI note value
export function noteHz(note: number) {
	return (440 / 32) * (2 ** ((note - 9) / 12));
}

export function isBlackKey(note: number) {
	return [
		//	C#,	D#, F#, G#, A#
			1,	3,	6,	8,	10
	].includes(note % 12);
}
