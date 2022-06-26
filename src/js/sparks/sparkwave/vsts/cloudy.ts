/*
* Cloudy, a free open-source oscillator synth for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {VST, VSTInstance} from "../classes";

export default class Cloudy extends VST {
	drawUI() {
		console.log("amogus");
	}

	static instance(): VSTInstance {
		return new VSTInstance(Cloudy);
	}
}
