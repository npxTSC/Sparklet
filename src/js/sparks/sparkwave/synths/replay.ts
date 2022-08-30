/*
* RePlay, a free open-source sampler for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {noteHz,
		SYNTH_BORDERS,
		SYNTH_TITLEBAR_HEIGHT
}								from "../main";
import {Synth, Sample, Vec2_i}	from "../classes";
import {Rectangle, Text,
		UIComponent,	PianoWidget	}		from "../dtools";
import {dman}					from "libdx";

const defaultSampleURI = "/public/sparks/sparkwave/debug/ckey.wav";


export default class RePlay extends Synth {
	public ui:		Record<string, UIComponent>	= {};
	private sample:	Sample | null;
	private piano:	PianoWidget;
	
	constructor(ctx: AudioContext, smp?: Sample) {
		super(ctx);

		this.sample = smp ?? null;
		
		const bg = new Rectangle(
			0, 0,
			this.w,
			this.h,
		);
		
		bg.color	= "#87ceeb";
		bg.borderWidth = 4;
		bg.borderColor = "black";
		
		dman.ptr(bg, "w", () => this.w-(2*SYNTH_BORDERS));
		dman.ptr(bg, "h", () => this.h-(SYNTH_TITLEBAR_HEIGHT+SYNTH_BORDERS));

		this.ui.bg = bg;

		

		this.piano = new PianoWidget(
			4,
			-1,
			-1,
			50,
		);

		dman.ptr(this.piano, "y", () => this.h-58);
		dman.ptr(this.piano, "w", () => this.w-16);

		this.piano.keyCount = 48;
		this.refreshPiano();

		this.ui.piano = this.piano;

		

		const titletext = new Text(
			"RePlay",
			(SYNTH_BORDERS*2),
			(SYNTH_BORDERS)+30
		);

		titletext.color = "black";
		titletext.z		= 50;

		this.ui.title = titletext;
	}

	async loadSample(buf: AudioBuffer) {
		if (!(this.sample)) this.sample = new Sample();
		this.sample.buffer = buf;
	}

	refreshPiano() {
		this.piano.updateKeys();
		this.piano.updateKeyActions(
			(note) => this.noteOn(note, 127),
			(note) => this.noteOff(note),
		);
	}
	
	override draw(c: CanvasRenderingContext2D) {
		const sorted = Object.values(this.ui)
			.sort((a, b) => a.z - b.z);
		
		const offset = new Vec2_i(this.x, this.y);
		sorted.forEach(cmp => cmp.draw(c, offset));
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
		if (!this.sample) return;

		const buf = this.sample.buffer;

		const source = this.ctx.createBufferSource();
		source.buffer = buf;
		source.connect(this.ctx.destination);
		source.start();
	}

	override noteOff(note: number) {}
}
