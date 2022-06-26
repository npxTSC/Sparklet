"use strict";

import {rand, elem, str}		from "libdx";
import {Howl, Howler}			from "howler";
import Cloudy					from "./vsts/cloudy";
import {
	Sample,	Rhythm,
	VST, VSTInstance,
	theme
}	from "./classes";

// Web prep stuff
const {setInterval} = window;
const ctx			= new AudioContext();
const testSample	= new Sample();
const canvas		= <HTMLCanvasElement> document.getElementById("mainCanvas");
const c				= canvas.getContext("2d");
const FPS			= 60;

const activeVSTs: VSTInstance[]	= [];


window.addEventListener("resize", resizeHandler);
resizeHandler();


activeVSTs.push(new VSTInstance(Cloudy));


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
		c.fillStyle = theme.VST_BACKGROUND;
		c.fillRect(	instance.x, instance.y,
					instance.w, instance.h	);
		
		c.font = "32px serif";
		c.fillStyle = "#fff";
		c.fillText("Amogus", 10, 32);
		continue;
	}
}



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
