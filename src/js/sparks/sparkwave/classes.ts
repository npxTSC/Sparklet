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

export class VSTInstance {
	public uiActive:	boolean;
	public x:			number;
	public y:			number;
	public w:			number;
	public h:			number;

	constructor(vst: VST) {
		this.uiActive	= true;
		this.x			= 0;
		this.y			= 0;
		this.w			= 400;
		this.h			= 300;
	}
}

export abstract class VST {
	//
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
