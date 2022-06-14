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

export abstract class Effect {
	//
}

export type Rhythm = boolean[];
