/*
* RePlay, a free open-source sampler for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {Howl, Howler}			from "howler";
import {noteHz,
		SYNTH_BORDERS,
		SYNTH_TITLEBAR_HEIGHT
}								from "../main";
import {Synth, Sample, Vec2_i}	from "../classes";
import {Rectangle, Text,
		UIComponent		}		from "../dtools";

const defaultSampleURI = "/public/sparks/sparkwave/debug/ckey.wav";


export default class RePlay extends Synth {
	public ui:		Record<string, UIComponent>	= {};
	private sample:	Sample | null;
	
	constructor(ctx: AudioContext, smp?: Sample) {
		super(ctx);

		this.sample = smp ?? null;
		
		const bg = new Rectangle(
			0, 0,
			this.w-(2*SYNTH_BORDERS),
			this.h-(SYNTH_TITLEBAR_HEIGHT+SYNTH_BORDERS),
		);

		bg.color	= "#87ceeb";
		this.ui.bg = bg;

		const titletext = new Text(
			"RePlay",
			(SYNTH_BORDERS*2),
			(SYNTH_BORDERS)+30
		);

		titletext.color = "black";
		titletext.z		= 50;

		this.ui.title = titletext;
	}
	
	override draw(c: CanvasRenderingContext2D) {
		const sorted = Object.values(this.ui)
			.sort((a, b) => a.z - b.z);
		
		sorted.forEach(cmp => cmp.draw(c, new Vec2_i(
				this.x+SYNTH_BORDERS,
				this.y+SYNTH_TITLEBAR_HEIGHT
			)
		));
	}

	override updateDisplay() {}

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
