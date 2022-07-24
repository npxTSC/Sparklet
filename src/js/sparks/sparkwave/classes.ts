"use strict";

import {Howl}	from "howler";

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

export class VST {
	constructor(protected ctx: AudioContext) {}
	
	visible:			boolean	= true;
	isBeingDragged:		boolean	= false;
	acceptsMidiInput:	boolean	= true;
	x:					number	= 50;
	y:					number	= 50;
	w:					number	= 400;
	h:					number	= 300;
	
	draw(c: CanvasRenderingContext2D) {}
	updateDisplay() {}
	
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

export abstract class Effect {
	//
}

export type Rhythm = boolean[];

export const theme = {
	TITLEBAR:		"#222",
	BACKGROUND:		"#383838",
	VST_TITLEBAR:	"#333",
	VST_BACKGROUND:	"#4f4f4f",
}
