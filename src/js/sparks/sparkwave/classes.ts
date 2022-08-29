"use strict";

import {Howl}			from "howler";
import {UIComponent}	from "./dtools";

const DEFAULT_SAMPLE_SRC = "/public/sparks/sparkwave/debug/ckey.wav";

export class Sample {
	public buffer:	AudioBuffer;
	public volume:	number = 100;
	public effects:	Effect[];
	
	constructor(ctx?: AudioContext, src?: string) {
		if (ctx) {
			if (!src) src = DEFAULT_SAMPLE_SRC;
			
			const file = fetch(src)
				.then(response => response.arrayBuffer())
				.then(buffer => ctx.decodeAudioData(buffer))
				.then(buffer => {
					let track = ctx.createBufferSource();
					track.buffer = buffer;
					track.connect(ctx.destination);
					track.start(0);
					alert(buffer);
			});
		}
	}

	static play(smp: Sample) {}
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

export const theme = {
	TITLEBAR:			"#222",
	BACKGROUND:			"#383838",
	PLUGIN_TITLEBAR:	"#333",
	PLUGIN_BACKGROUND:	"#4f4f4f",
	PLUGIN_EMPTY:		"aliceblue", //"#fff",
}
