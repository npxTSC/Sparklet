// Module for providing classes/types to app.ts
"use strict";

export interface Room {
	joinHash:	number;
	ownerAccId:	number;
	quizId:		number;
	currentQ:	number;
	players:	Player[];
}

export interface Player {
	username:	string;
	accountId:	number | null;
	correctQs:	number;
}
