// Classes for use in the free eVST GUIs
"use strict";

import {isBlackKey}	from "./main";

export interface UIComponent {
	draw:	(c: CanvasRenderingContext2D, offset?: Vector2D) => void;
	z:		number;
}

export type Vector2D = [number, number];

export class Point implements UIComponent {
	public color:	string;
	public z:		number	= 0;
	
	constructor(
		public x:	number,
		public y:	number,
	) {}

	draw(c: CanvasRenderingContext2D, offset: Vector2D = [0,0]) {}
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

	draw(c: CanvasRenderingContext2D, offset: Vector2D = [0,0]) {
		// Draw border
		c.fillStyle = this.borderColor;
		c.fillRect(
			this.x+offset[0],
			this.y+offset[1],
			this.w,
			this.h
		);

		// Draw inner section
		c.fillStyle = this.color;
		c.fillRect(
			this.x+offset[0]	+ this.borderWidth,
			this.y+offset[1]	+ this.borderWidth,
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

	draw(c: CanvasRenderingContext2D, offset: Vector2D = [0,0]) {
		c.font = `${this.fontSize}px ${this.font}`;
		c.fillStyle = this.color;
		c.fillText(this.text, this.x+offset[0], this.y+offset[1]);
	}
}



// Piano Widget classes

export class PianoWidget extends Rectangle
			implements UIComponent {
	private keys:		PianoKey[] = [];
	public keyCount:	number	= 12;
	public startKey:	number	= 48; // Middle C
	
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

	onClick(mx: number, my: number, hostPos: Vector2D) {
		const rel = {
			x:	mx - (hostPos[0] + this.x),
			y:	my - (hostPos[1] + this.y)
		}

		const keyWidth = this.w / this.keyCount;
		const keyPressed = Math.floor(rel.x / keyWidth);
		console.log(keyPressed);
	}

	draw(c: CanvasRenderingContext2D, offset: Vector2D = [0,0]) {
		c.fillStyle	= this.color;
		c.fillRect(
			this.x+offset[0],
			this.y+offset[1],
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
			offset: Vector2D = [0,0],
			keyColors: string[] = ["white", "black"]) {
		
		c.fillStyle = isBlackKey(this.note) ? keyColors[1] : keyColors[0];
		c.fillRect(
			this.x+offset[0],
			this.y+offset[1],
			this.w,
			this.h / (isBlackKey(this.note) ? 1.5 : 1)
		);
	}
}
