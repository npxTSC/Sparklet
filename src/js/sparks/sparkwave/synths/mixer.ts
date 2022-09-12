/*
* Sparkwave's default mixer plugin
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {
	noteHz,
	SYNTH_BORDERS,
	SYNTH_TITLEBAR_HEIGHT,
	pointWithin
}								from "../main";
import {
	Synth, Effect, Vec2_i,
	MixerTrack
}								from "../classes";
import {Rectangle, Text,
		UIComponent}			from "../dtools";
import {dman}					from "libdx";

const OUTSET_W			= 4;
const TRACK_BORDER_W	= 1;
const TRACK_BORDER_COL	= "gray";
const TRACK_BG_COL		= "darkslategray";

export default class Mixer extends Synth {
	public ui:				Record<string, UIComponent>	= {};
	public tracks:			MixerTrack[] = [];
	
	constructor(ctx: AudioContext) {
		super(ctx);
		
		const bg = new Rectangle(
			0, 0,
			this.w,
			this.h,
		);
		
		bg.color		= "lightgray";
		bg.borderWidth	= OUTSET_W;
		bg.borderColor	= "black";
		
		dman.ptr(bg, "w", () => this.w);
		dman.ptr(bg, "h", () => this.h);

		this.ui.bg = bg;


		const mxCmp = new MixerUI(0, 0, 0, 0);
		dman.ptr(mxCmp, "w", () => this.w*0.7 - (2*OUTSET_W));
		dman.ptr(mxCmp, "h", () => this.h*0.75 - (2*OUTSET_W));
		dman.ptr(mxCmp, "x", () => OUTSET_W + this.x);
		dman.ptr(mxCmp, "y", () => OUTSET_W + this.y+(this.h*0.25));
		dman.ptr(mxCmp, "trackPtr", () => this.tracks);
		this.ui.mixer = mxCmp;
		

		const titletext = new Text(
			"Mixer Rack",
			15,
			50
		);

		titletext.color = "black";
		titletext.z		= 50;

		this.ui.title = titletext;
	}
	
	override draw(c: CanvasRenderingContext2D) {
		const sorted = Object.values(this.ui)
			.sort((a, b) => a.z - b.z);
		
		const offset = new Vec2_i(this.x, this.y);
		sorted.forEach(cmp => cmp.draw(c, offset));
	}
}

class MixerUI extends Rectangle
		implements UIComponent {
	private trackWidgets:	MixerTrackUI[] = [];
	private trackCount:		number	= 16;
	
	updateTrackWidgets() {
		// Clear the array
		this.trackWidgets = [];

		// Make new keys
		for (let i = 0; i < this.trackCount; i++) {
			const track = new MixerTrackUI(
				this.x + (i * (this.w / this.trackCount)),
				this.y,
				this.w / this.trackCount,
				this.h,
			);
			
			this.trackWidgets.push(track);
		}
	}
	
	draw(c: CanvasRenderingContext2D) {
		this.updateTrackWidgets();
		this.trackWidgets.forEach((v) => v.draw(c));
	}
}

class MixerTrackUI extends Rectangle
		implements UIComponent {
	
	constructor(
		x:	number,
		y:	number,
		w:	number,
		h:	number,
	) {
		super(x, y, w, h);
		this.color = TRACK_BG_COL;
		this.borderWidth = TRACK_BORDER_W;
		this.borderColor = TRACK_BORDER_COL;
	}

	draw(c: CanvasRenderingContext2D) {
		super.draw(c, Vec2_i.ZEROES());
	}
}
