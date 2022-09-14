// Classes for use in developing plugins
"use strict";

import {isBlackKey, whiteKeyBelow}			from "./main";
import {Vec2_i, OrderedPair, MOUSEBUTTONS}	from "./classes";

const BLACK_KEY_HEIGHT_COEFFICIENT = 0.6;

export interface UIComponent {
	draw:	(c: CanvasRenderingContext2D, offset?: OrderedPair) => void;
	z:		number;
}

export class Point implements UIComponent {
	public color:	string;
	public z:		number	= 0;
	
	constructor(
		public x:	number,
		public y:	number,
	) {}

	draw(c: CanvasRenderingContext2D, offset: OrderedPair = Vec2_i.ZEROES()) {}
}

export class Rectangle extends Point
			implements UIComponent {
	public borderColor:	string	= "black";
	public borderWidth:	number	= 0;
	
	constructor(
		x:			number,
		y:			number,
		public w:	number,
		public h:	number,
	) {
		super(x, y);
	}

	draw(c: CanvasRenderingContext2D, offset: OrderedPair = Vec2_i.ZEROES()) {
		// Draw border
		c.fillStyle = this.borderColor;
		c.fillRect(
			this.x+offset.x,
			this.y+offset.y,
			this.w,
			this.h
		);

		// Draw inner section
		c.fillStyle = this.color;
		c.fillRect(
			this.x+offset.x		+ this.borderWidth,
			this.y+offset.y		+ this.borderWidth,
			this.w				- 2*this.borderWidth,
			this.h				- 2*this.borderWidth
		);
	}
}

export class Text extends Point
			implements UIComponent {
	public fontSize:	number	= 32;
	public font:		string	= "serif";
	
	constructor(
		public text:	string,
		x:				number,
		y:				number,
	) {
		super(x, y);
	}

	draw(c: CanvasRenderingContext2D, offset: OrderedPair = Vec2_i.ZEROES()) {
		c.font = `${this.fontSize}px ${this.font}`;
		c.fillStyle = this.color;
		c.fillText(this.text, this.x+offset.x, this.y+offset.y);
	}
}



// Piano Widget classes

export class PianoWidget extends Rectangle
			implements UIComponent {
	private keys:		PianoKey[] = [];
	public keyCount:	number	= 12;
	public startKey:	number	= 36; // Middle C
	
	constructor(
		x:	number,
		y:	number,
		w:	number,
		h:	number,
	) {
		super(x,y,w,h);
		this.color = "white";
		this.updateKeys();
	}

	updateKeys() {
		// Clear the array
		this.keys = [];

		// Make new keys
		for (let i = 0; i < this.keyCount; i++) {
			const key = new PianoKey(
				this.x + (i * (this.w / this.keyCount)),
				this.y,
				this.w / this.keyCount,
				this.h,
			);

			key.note = this.startKey + i;
			
			this.keys.push(key);
		}
	}

	updateKeyActions(
		keyAction: (key: number) => void,
		keyReleaseAction: (key: number) => void
	) {
		this.keys.forEach((v, i) => {
			v.onClick = () => keyAction(this.startKey + i);
			v.onRelease = () => keyReleaseAction(this.startKey + i);
		});
	}

	onClick(	
		mx:		number,
		my:		number,
		hostPos: OrderedPair,
		rel:	boolean,
		mb:		number,
	) {
		// Relative position
		const lpos = {
			x:	(hostPos.x + this.x),
			y:	(hostPos.y + this.y)
		}

		const keyWidth = this.w / this.keyCount;
		const keyFromW = Math.floor((mx - lpos.x) / keyWidth);

		const keyPressedN = (
			((my - lpos.y) < (this.h * BLACK_KEY_HEIGHT_COEFFICIENT)) ?
			keyFromW :
			whiteKeyBelow(keyFromW)
		);

		const keyPressedO = this.keys[keyPressedN];

		if (mb === MOUSEBUTTONS.Left) {
			(	rel ?
				keyPressedO.onRelease :
				keyPressedO.onClick
			)();
		}
	}

	draw(c: CanvasRenderingContext2D, offset: OrderedPair = Vec2_i.ZEROES()) {
		c.fillStyle	= this.color;
		c.fillRect(
			this.x+offset.x,
			this.y+offset.y,
			this.w,
			this.h
		);

		this.keys.forEach((key) => key.draw(c, offset, [this.color, "black"]));
	}
}

export class NotePlayerWidget extends Rectangle
		implements UIComponent {
	public note = 60;

	constructor(
		x:	number,
		y:	number,
		w:	number,
		h:	number,
	) {
		super(x,y,w,h);
	}

	onClick(): void {}
	onRelease(): void {}
}
				
export class PianoKey extends NotePlayerWidget
		implements UIComponent {
	
	draw(	c: CanvasRenderingContext2D,
			offset: OrderedPair = Vec2_i.ZEROES(),
			keyColors: string[] = ["white", "black"]) {
		
		c.fillStyle = isBlackKey(this.note) ? keyColors[1] : keyColors[0];
		c.fillRect(
			this.x+offset.x,
			this.y+offset.y,
			this.w,
			this.h * (isBlackKey(this.note) ? BLACK_KEY_HEIGHT_COEFFICIENT : 1)
		);
	}
}
