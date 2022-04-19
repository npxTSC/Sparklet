// Module for providing classes/types to app.ts
"use strict";

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

export interface Keyable<T> {
	[key: string]: T;
}
