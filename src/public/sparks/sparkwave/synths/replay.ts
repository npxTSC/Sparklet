/*
* RePlay, a free open-source sampler for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {noteHz,
		SYNTH_BORDERS,
		SYNTH_TITLEBAR_HEIGHT,
		pointWithin
}									from "../main";
import {Synth, Sample, Vec2_i}		from "../classes";
import {Rectangle, Text,
		UIComponent, PianoWidget}	from "../dtools";
import {dman}						from "libdx";

export default class RePlay extends Synth {
	public ui:		Record<string, UIComponent>	= {};
	private sample:	Sample | null;
	private piano:	PianoWidget;
	
	constructor(ctx: AudioContext, smp?: Sample) {
		super(ctx);

		if (smp) this.sample = smp;
		else this.loadSample();
		
		const bg = new Rectangle(
			0, 0,
			this.w,
			this.h,
		);
		
		bg.color	= "#87ceeb";
		bg.borderWidth = 4;
		bg.borderColor = "black";
		
		dman.ptr(bg, "w", () => this.w);
		dman.ptr(bg, "h", () => this.h);

		this.ui.bg = bg;

		

		this.piano = new PianoWidget(
			4,
			-1,
			-1,
			-1,
		);

		dman.ptr(this.piano, "w", () => this.w-8);
		dman.ptr(this.piano, "h", () => this.h/6);
		dman.ptr(this.piano, "y", () => this.h-(this.piano.h+4));

		this.piano.keyCount = 48;
		this.piano.z = 10;
		this.refreshPiano();

		this.ui.piano = this.piano;

		

		const titletext = new Text(
			"RePlay Sampler",
			15,
			50
		);

		titletext.color = "black";
		titletext.z		= 50;

		this.ui.title = titletext;
	}

	async loadSample(buf?: AudioBuffer) {
		this.sample = new Sample()
		this.sample.buffer = buf ?? (await Sample.load());
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

	override onClick(
		x:		number,
		y:		number,
		rel:	boolean,
		mb:		number,
	) {
		const w = this;
		const p = this.piano

		// If clicked on piano, pass click to widget code
		if (pointWithin(
			x, y,
			w.x+p.x, w.y+p.y,
			p.w, p.h
		)) {
			p.onClick(x, y, new Vec2_i(this.x, this.y), rel, mb);
		}
	}

	override noteOn(note: number, velocity: number) {
		if (!this.sample) return;

		const buf = this.sample.buffer;
		const rootDiff = note - this.sample.root;
		
		const source = new AudioBufferSourceNode(this.ctx, {
			buffer: buf,
			detune: rootDiff * 100,
		});
		
		source.connect(this.ctx.destination);
		source.start();
	}

	override noteOff(note: number) {}
}
