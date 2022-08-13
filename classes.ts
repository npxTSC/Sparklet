// Module for providing classes/types to app.ts
"use strict";

export interface Conductor {
	username:	string;
	id:			number;
}

export interface Room {
	joinHash:	string;
	ownerAccId:	string;
	authToken:	string;
	quizId:		string;
	currentQ:	number;
	status:		string;
	players:	QuizPlayer[];
}

export interface QuizPlayer {
	username:	string;
	correctQs:	number;
	tempToken:	string;
	account?:	AccountPublic;
}

export interface AccountPublic {
	name:	string;
	uuid:	string;
}

export interface QuizHostCommand {
	room:	string;
	auth:	string;
	cmd:	string;
}

export interface QuizHostResponse {
	players?:	QuizPlayer[];
	alert?:		string;
}

export type QuizHostCmdFn = (
	(args: string[], room?: Room) =>
		QuizHostResponse
);

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
