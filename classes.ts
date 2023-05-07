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
	account?:	SparkletDB.SparkletUser;
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
	/*
	* These interfaces should all contain only primitives...
	*
	* Maybe create classes that have methods to access
	* data in a more dev-friendly way later?
	*/

	export interface SparkletUser extends RowDataPacket {
		uuid:			string,
		name:			string,
		passHash:		string,
		date:			number,
		adminRank:		number,
		emailVerified:	boolean,
		emailVToken?:	string,
		authToken?:		string,
		pfpSrc?:		string,
		bio?:			string,
	}

	export type SparkletUserPublic =
		Omit<SparkletUser, "id" | "passHash" | "emailVToken" | "authToken">;
	
	export interface Capsule extends RowDataPacket {
		uuid:		string;
		name:		string;
		creator:	string;
		version:	string;
		content:	string;
		visible:	boolean;
		date:		number;
		likes:		number;
	}
	
	export interface NewsPost extends RowDataPacket {
		uuid:		string;
		title:		string;
		author:		string;
		content:	string;
		visible:	boolean;
		date:		number;

//		possible new feature?
//		likes:		number;
	}

	export interface Spark extends RowDataPacket {
		uuid:			string;
		title:			string;
		creator:		string;
		description:	string;
		visible:		boolean;
		date:			number;
	}
}
