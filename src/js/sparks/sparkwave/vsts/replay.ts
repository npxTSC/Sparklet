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
const defaultSampleURI = "/public/sparks/sparkwave/debug/ckey.wav";


export default class RePlay extends VST {
	private ui:		Record<string, UIComponent>	= {};
	private sample:	Sample;
	
	constructor(ctx: AudioContext, smp?: Sample) {
		super(ctx);

		this.sample = smp ?? new Sample(defaultSampleURI);
		
		const bg = new Rectangle(
			this.x+border,
			this.y+border,
			this.w-(2*border),
			this.h-(2*border),
		);

		bg.color	= "aliceblue";
		this.ui.bg = bg;

		const titletext = new Text(
			"RePlay",
			this.x+(border*2),
			this.y+(border)+50
		);

		titletext.color = "black";
		titletext.z		= 50;

		this.ui.title = titletext;
	}
	
	draw(c: CanvasRenderingContext2D) {
		const sorted = Object.values(this.ui)
			.sort((a, b) => a.z - b.z);
		
		sorted.forEach(cmp => cmp.draw(c));
	}

	updateDisplay() {
		[	(<Rectangle>this.ui.bg).x,
			(<Rectangle>this.ui.bg).y	]
				= [this.x+border, this.y+border];
		
		[	(<Text>this.ui.title).x,
			(<Text>this.ui.title).y	]
				= [this.x+(border*2), this.y+border+50];
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
