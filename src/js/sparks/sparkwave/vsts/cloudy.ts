/*
* Cloudy, a free open-source oscillator synth for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {VST}	from "../classes";

export default class Cloudy extends VST {
	constructor() {
		super();
	}
	
	draw(c: CanvasRenderingContext2D) {
		c.fillStyle = "red";
		c.fillRect(	this.x+4, this.y+4,
					this.w-8, this.h-8	);
	}
}
