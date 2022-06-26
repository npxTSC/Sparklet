/*
* Cloudy, a free open-source oscillator synth for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {VST}				from "../classes";
import {Rectangle, Text}	from "../dtools";

const border = 4;

export default class Cloudy extends VST {
	private bg: Rectangle;
	
	constructor() {
		super();
		
		this.bg = new Rectangle(
			this.x+border,
			this.y+border,
			this.w-(2*border),
			this.h-(2*border),
		);

		this.bg.color = "aliceblue";
	}
	
	draw(c: CanvasRenderingContext2D) {
		this.bg.draw(c);
	}

	updateDisplay() {
		[this.bg.x, this.bg.y] = [this.x+border, this.y+border];
	}

	onMidiInput() {
		//
	}
}
