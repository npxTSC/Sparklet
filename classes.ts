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
//	account?:	AccountPublic;
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
		id:				number,
		uuid:			string,
		name:			string,
		passHash:		string,
		date:			number,
		adminRank:		number,
		emailVerified:	boolean,
		emailVToken?:	string,
		authToken?:		string,
		bio?:			string,
	}

	export type SparkletUserPublic =
		Omit<SparkletUser, "id" | "passHash" | "emailVToken" | "authToken">;
	
	export interface Capsule {
		id:			number,
		uuid:		string;
		name:		string;
		creator:	string;
		version:	string;
		content:	string;
		visible:	boolean;
		date:		number;
		likes:		number;
	}

	export type CapsulePublic =
		Omit<Capsule, "id">;
	
	export interface NewsPost {
		id:			number,
		uuid:		string;
		title:		string;
		author:		string;
		content:	string;
		visible:	boolean;
		date:		number;

//		possible new feature?
//		likes:		number;
	}

	export type NewsPostPublic =
		Omit<Capsule, "id">;

	export interface Spark {
		id:				number,
		uuid:			string;
		title:			string;
		creator:		string;
		description:	string;
		visible:		boolean;
		date:			number;
	}

	export type SparkPublic =
		Omit<Capsule, "id">;
}
