"use strict";

const defaultSampleURL = "http://starmen.net/mother2/soundfx/error.wav";

export class Sample {
	public src:		string;
	public volume:	number = 100;
	public effects:	Effect[];
	
	constructor(ct_src?: string) {
		this.src = ct_src ?? defaultSampleURL;
	}
}

export class VST {
	uiActive:	boolean	= true;
	x:			number	= 50;
	y:			number	= 50;
	w:			number	= 400;
	h:			number	= 300;
	
	draw(c: CanvasRenderingContext2D) {}
}

export abstract class Effect {
	//
}

export type Rhythm = boolean[];

export const theme = {
	TITLEBAR:		"#222",
	BACKGROUND:		"#383838",
	VST_BACKGROUND:	"#4f4f4f",
}
