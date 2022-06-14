"use strict";

import {rand, elem, str}	from "libdx";
import {Howl, Howler}		from "howler";
import {Sample, Rhythm}		from "./classes";

// Web prep stuff
const {setInterval} = window;
const ctx			= new AudioContext();
const testSample	= new Sample();

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
