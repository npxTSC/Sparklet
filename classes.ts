// Module for providing classes/types to app.ts
"use strict";

import { RowDataPacket }	from "mysql2/promise";

// crab noises
export type Option<T> = T | null;

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
	uuid:		string;
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

export enum AdminRank {
	Conductor,
	Helper,
	Electrician,
	Manager,
	Operator
}

export namespace SparkletDB {
	interface SparkletUser extends RowDataPacket {
		id:				number,
		uuid:			string,
		name:			string,
		passHash:		string,
		date:			number,
		adminRank:		AdminRank,
		emailVerified:	boolean,
		emailVToken?:	string,
		authToken?:		string,
		bio?:			string,
	}

	export type SparkletUserPrivate =
		Omit<SparkletUser, "id" | "passHash" | "emailVToken" | "authToken">;

	/*
		CREATE TABLE IF NOT EXISTS news(
			id			INT			PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT		NOT NULL,
			title		TEXT		NOT NULL,
			author		TEXT		NOT NULL DEFAULT 'Anonymous',
			content		TEXT		NOT NULL,
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE IF NOT EXISTS games(
			id			INT			PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT		NOT NULL,
			title		TEXT		NOT NULL,
			creator		TEXT		NOT NULL DEFAULT 'Anonymous',
			description	TEXT		NOT NULL DEFAULT 'No description given... :(',
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		
		CREATE TABLE IF NOT EXISTS capsules(
			id			INT			PRIMARY KEY AUTO_INCREMENT,
			uuid		TEXT		NOT NULL,
			name		TEXT		NOT NULL,
			creator		TEXT		NOT NULL,
			version		TEXT		NOT NULL,
			content		TEXT		NOT NULL,
			visible		BOOLEAN		NOT NULL DEFAULT 1,
			date		DATETIME	NOT NULL DEFAULT CURRENT_TIMESTAMP,
			likes		INTEGER		NOT NULL DEFAULT 0
		);
	*/
}
