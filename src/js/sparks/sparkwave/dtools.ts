// Classes for use in the free eVST GUIs
"use strict";

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

export class PianoWidget extends Rectangle
			implements UIComponent {
	public keys:		number		= 12;
	public startKey:	number		= 48; // Middle C
	
	constructor(
		x:	number,
		y:	number,
		w:	number,
		h:	number,
	) {
		super(x,y,w,h);
	}

	draw(c: CanvasRenderingContext2D, offset: Vector2D = [0,0]) {
		c.fillStyle	= "white";
		c.fillRect(
			this.x+offset[0],
			this.y+offset[1],
			this.w,
			this.h
		);

		//
	}
}
