/*
* RePlay, a free open-source sampler for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {Howl, Howler}		from "howler";
import {noteHz}				from "../main";
import {VST, Sample}		from "../classes";
import {Rectangle, Text,
		UIComponent		}	from "../dtools";

const border = 4;

export default class RePlay extends VST {
	private ui:		Record<string, UIComponent>	= {};
	
	constructor(ctx: AudioContext) {
		super(ctx);
		
		const bg = new Rectangle(
			this.x+border,
			this.y+border,
			this.w-(2*border),
			this.h-(2*border),
		);

		bg.color = "aliceblue";

		this.ui.bg = bg;
	}
	
	draw(c: CanvasRenderingContext2D) {
		Object.values(this.ui).forEach(cmp => cmp.draw(c));
	}

	updateDisplay() {
		[	(<Rectangle>this.ui.bg).x,
			(<Rectangle>this.ui.bg).y	]
				= [this.x+border, this.y+border];
	}

	override onMidiInput(	command:	number,
						 	note:		number,
							velocity:	number) {
		switch (command) {
			case 144: // Note ON
				if (velocity > 0) this.noteOn(note, velocity);
				else this.noteOff(note);
				break;
				
			case 128: // Note OFF
				this.noteOff(note);
				break;
		}
	}

	override noteOn(note: number, velocity: number) {
		//oscn.osc.frequency.value = noteHz(note);
	}

	override noteOff(note: number) {}
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