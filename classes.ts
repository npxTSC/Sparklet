// Module for providing classes/types to app.ts
"use strict";

export interface Conductor {
	username:	string;
	id:			number;
}

export interface Room {
	joinHash:	number;
	ownerAccId:	number;
	quizId:		number;
	currentQ:	number;
	players:	ActiveQuizPlayer[];
}

export interface ActiveQuizPlayer {
	username:	string;
	accountId:	number | null;
	correctQs:	number;
	tempToken:	string;
}

export interface Capsule {
	uuid:		string;
	name:		string;
	creator:	string;
	version:	string;
	content:	string;
	visible:	boolean;
	date:		Date;
	likes:		number;
}

export interface CapsuleContent {
	questions:	Record<string, number>;
	answers:	string[];
}

export enum Ranks {
	Conductor,
	Helper,
	Electrician,
	Manager,
	Operator
}
