"use strict";

import {rand, elem, str}	from "libdx";
import Cloudy				from "./synths/cloudy";
import RePlay				from "./synths/replay";
import Mixer				from "./synths/mixer";
import {
	Sample,	Rhythm,
	Synth, theme, SWPlugin,
	MOUSEBUTTONS, Vec2_i, OrderedPair,
	CURSOR_STYLES
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
const canvas		= <HTMLCanvasElement> document.getElementById("mainCanvas");
const c				= canvas.getContext("2d")!;
const FPS			= 60;

// The synth in this slot is the one that renders audio
// There's pretty much no reason to edit this unless you
// are using a custom mixer plugin, in which case
// you're free to do so (the variable is mutable).
let master			= new Mixer(ctx);

const activePlugins: SWPlugin[]		= [];


let mouse		= new Vec2_i(0,0);
let mouseDown	= false;


window.addEventListener("resize", resizeHandler);
resizeHandler();


// Debug pre-initialized plugins
activePlugins.push(
	master,
	new RePlay(ctx),
);

activePlugins[1].w = 1000;
activePlugins[1].h = 600;
(<RePlay>activePlugins[1]).refreshPiano();

if (navigator.requestMIDIAccess) {
	navigator.requestMIDIAccess().then((midi) => {
		// Success
		const {inputs, outputs} = midi;

		inputs.forEach((input) => {
			input.onmidimessage = midiMessageHandler;
		});
	}, () => {
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

		instance.draw(c);

		c.fillStyle = theme.PLUGIN_TITLEBAR;
		c.fillRect(instance.x, instance.y, instance.w, SYNTH_TITLEBAR_HEIGHT);
	}
}

canvas.addEventListener("mousemove", (e) => {
	const rect	= canvas.getBoundingClientRect();
	const mx = e.clientX - rect.left;
	const my = e.clientY - rect.top;

	for (const instance of [...activePlugins].reverse()) {
		if (!instance.isBeingDragged) continue;
		instance.x += (mx-mouse.x);
		instance.y += (my-mouse.y);
		instance.updateDisplay();
	}

	const instance = instancesUnderCursor()[0];
	if (instance) {
		const mouseStyleOverride = instance.mouseStyle();

		// If the plugin has specific style rules for
		// the current position, use them
		if (mouseStyleOverride) {
			setCursorStyle(mouseStyleOverride);
		} else {
			// If point within titlebar, change cursor to drag icon
			if (pointWithin(
				mouse.x,	mouse.y,
				instance.x,	instance.y,
				instance.w,	SYNTH_TITLEBAR_HEIGHT)
			) {
				setCursorStyle(CURSOR_STYLES.Drag);
			} else {
				setCursorStyle(CURSOR_STYLES.Arrow);
			}
		}
	} else {
		setCursorStyle(CURSOR_STYLES.Arrow);
	}
	
	mouse = Vec2_i.from([mx, my]);
});

canvas.addEventListener("mousedown", (e) => {
	
	mouseDown = true;

	const instance = instancesUnderCursor()[0];
	if (!instance) return;

	
	// If dragging titlebar
	if (pointWithin(
		mouse.x,	mouse.y,
		instance.x,	instance.y,
		instance.w,	SYNTH_TITLEBAR_HEIGHT)
	) {
		if (e.button === MOUSEBUTTONS.Left) {
			// Set dragging
			instance.isBeingDragged = true;
		}
	} else {
		// Otherwise, pass control to the plugin
		instance.onClick(mouse.x, mouse.y, false, e.button);
	}
});

canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;

	for (const instance of activePlugins) {
		instance.isBeingDragged = false;
	}
	
	const instance = instancesUnderCursor()[0];
	if (!instance) return;

	
	// If NOT dragging titlebar
	if (!pointWithin(
		mouse.x,	mouse.y,
		instance.x,	instance.y,
		instance.w,	SYNTH_TITLEBAR_HEIGHT)
	) {
		// Pass control to the plugin
		instance.onClick(mouse.x, mouse.y, true, e.button);
	}
});

document.addEventListener("contextmenu", (e) => {
	e.preventDefault();
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

export function pointWithinV(
	pt:		OrderedPair,
	rpos:	OrderedPair,
	rsize:	OrderedPair
) {
	return pointWithin(
		pt.x, pt.y,
		rpos.x, rpos.y,
		rsize.x, rsize.y
	);
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

export function whiteKeyBelow(note: number) {
	if (!isBlackKey(note)) return note;

	const rel = note % 12;

	const offset = [3, 10].includes(rel) ? 1 : -1;

	return note + offset;
}

// returns array of instances under cursor position
// sorted by Z order (first element is highest)
function instancesUnderCursor() {
	let res: SWPlugin[] = [];
	
	for (const instance of [...activePlugins].reverse()) {
		if (!instance.visible) continue;

		if (pointWithin(
			mouse.x,	mouse.y,
			instance.x,	instance.y,
			instance.w,	instance.h
		)) {
			
			res.push(instance);
		}
	}

	return res;
}

function setCursorStyle(style: `${CURSOR_STYLES}`) {
	document.body.style.cursor = style;
}
