/*
* Cloudy, a free open-source oscillator synth for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {Synth, theme, Vec2_i}	from "../classes";
import {
	noteHz,
	SYNTH_BORDERS,
	SYNTH_TITLEBAR_HEIGHT,
	pointWithin,
}								from "../main";
import {Rectangle, Text, PianoWidget}	from "../dtools";
import {dman}					from "libdx";

export default class Cloudy extends Synth {
	private oscs:		OscNote[][] = [[]];
	private bg:			Rectangle;
	private piano:		PianoWidget;
	
	constructor(ctx: AudioContext) {
		super(ctx);
		
		this.bg = new Rectangle(
			0,
			0,
			this.w,
			this.h,
		);
		
		this.bg.color = theme.PLUGIN_EMPTY;
		this.bg.borderWidth = 4;
		this.bg.borderColor = "black";

		dman.ptr(this.bg, "w", () => this.w);
		dman.ptr(this.bg, "h", () => this.h);

		
		this.piano = new PianoWidget(
			4,
			0,
			0,
			100,
		);

		dman.ptr(this.piano, "y", () => this.h-104);
		dman.ptr(this.piano, "w", () => this.w-8);
		

		this.piano.keyCount = 48;
		this.refreshPiano();
	}

	refreshPiano() {
		this.piano.updateKeys();
		this.piano.updateKeyActions(
			(note) => this.noteOn(note, 127),
			(note) => this.noteOff(note),
		);
	}
	
	override draw(c: CanvasRenderingContext2D) {
		const offset = new Vec2_i(this.x, this.y);
		
		this.bg.draw(c, offset);
		this.piano.draw(c, offset);
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
		const oscn = new OscNote(note, this.makeOscillator(0));
		oscn.osc.frequency.value = noteHz(note);

		this.oscs[0].push(oscn);
		
		oscn.osc.connect(this.ctx.destination);
		oscn.osc.start();
	}

	override noteOff(note: number) {
		for (const section of this.oscs) {
			section.forEach((oscn, i) => {
				// For each oscillator/note container,
				// Check if it's playing the note we want to end
				if (oscn.note !== note) return;
				
				oscn.osc.stop();
				oscn.osc.disconnect(this.ctx.destination);

				section.splice(i);
			});
		}
	}

	makeOscillator(section: number): OscillatorNode {
		return new OscillatorNode(this.ctx, {
			type: "triangle",
		});
	}
}

class OscNote {
	constructor(
		public note:	number,
		public osc:		OscillatorNode,
	) {}
}
