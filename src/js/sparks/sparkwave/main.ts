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

let mouseX: number, mouseY: number;
let mouseDown = false;


window.addEventListener("resize", resizeHandler);
resizeHandler();

// For debug, start out with 1 pre-initialized Cloudy eVST
activeVSTs.push(new Cloudy());




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
	mouseX		= e.clientX - rect.left;
	mouseY		= e.clientY - rect.top;
});

canvas.addEventListener("mousedown", (e) => {
	mouseDown = true;
	
	for (const instance of activeVSTs) {
		if (!instance.visible) continue;

		if (pointInsideRect(mouseX, mouseY,
			instance.x, instance.y,	instance.w, 20)) {
			
			alert("hi");
		}
	}
});

canvas.addEventListener("mouseup", (e) => {
	mouseDown = false;
});

setInterval(drawLoop, FPS/1000);











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
