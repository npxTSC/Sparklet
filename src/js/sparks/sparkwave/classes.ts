"use strict";

import {Howl}			from "howler";
import {UIComponent}	from "./dtools";

export class Sample {
	public src:		string;
	public volume:	number = 100;
	public effects:	Effect[];
	
	constructor(ct_src?: string) {
		this.src = ct_src ?? null;
	}

	static play(smp: Sample) {
		const sound = new Howl({
			src:		[smp.src],
			preload:	true,
		});
	
		sound.play();
		
		sound.on("end", () => {
			sound.unload();
		});
	}
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
	PLUGIN_EMPTY:		"#fff",
}
