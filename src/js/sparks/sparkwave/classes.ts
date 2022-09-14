"use strict";

import {UIComponent}	from "./dtools";
import {ctx, octx}		from "./main";

const DEFAULT_SAMPLE_SRC = "/public/sparks/sparkwave/debug/ckey.wav";

export class Sample {
	public buffer:	AudioBuffer;
	public volume:	number = 100;
	public root:	number = 60;
	
	static async load(src?: string) {
		const res = await fetch(src ?? DEFAULT_SAMPLE_SRC)
		const buffer = await res.arrayBuffer();
		const abuffer = await ctx.decodeAudioData(buffer);
		
		return abuffer;
	}
}

export interface MixerTrack {
	volume:		number;
	effects:	Effect[];
}

export class SWPlugin {
	constructor(protected ctx: AudioContext) {}
	
	visible:			boolean	= true;
	isBeingDragged:		boolean	= false;
	x:					number	= 50;
	y:					number	= 50;
	w:					number	= 400;
	h:					number	= 300;
	ui:					Record<string, UIComponent>	= {};

	draw(c: CanvasRenderingContext2D) {}
	updateDisplay() {}
	mouseStyle(): (`${CURSOR_STYLES}` | null) {
		return null;
	}
	
	acceptsMidiInput:	boolean	= true;
	
	onMidiInput(command: number, note: number, velocity: number) {
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

	onClick(x: number, y: number, rel: boolean, mb: number) {}

	noteOn(note: number, velocity: number) {}
	noteOff(note: number) {}
}

// Produces sound
export class Synth extends SWPlugin {
	//
}

// Modifies incoming sound
export class Effect extends SWPlugin {
	//
}

export type Rhythm = boolean[];

export type OrderedPair = Vec2_i<number>;

// Immutable Vector2
export class Vec2_i<CT> {
	constructor(private _x: CT, private _y: CT) {}

	static ZEROES() {
		return new Vec2_i(0, 0);
	}
	
	static from<T>(arr: [T, T]) {
		return new Vec2_i<T>(arr[0], arr[1]);
	}

	static add(v1: OrderedPair, v2: OrderedPair) {
		return new Vec2_i(v1.x + v2.x, v1.y + v2.y);
	}

	static subtract(v1: OrderedPair, v2: OrderedPair) {
		return new Vec2_i(v1.x - v2.x, v1.y - v2.y);
	}

	static negate(v: OrderedPair) {
		return new Vec2_i(-v.x, -v.y);
	}
	
	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}
}

export enum MOUSEBUTTONS {
	Left,
	Middle,
	Right,
	Thumb1,
	Thumb2
}

export const theme = {
	TITLEBAR:			"#222",
	BACKGROUND:			"#383838",
	PLUGIN_TITLEBAR:	"#333",
	PLUGIN_BACKGROUND:	"#4f4f4f",
	PLUGIN_EMPTY:		"aliceblue", //"#fff",
}

export const enum CURSOR_STYLES {
	Drag	= "move",
	Auto	= "auto",
	Arrow	= "default",
}
