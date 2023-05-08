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
	account?:	SparkletDB.SparkletUser<Date>;
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

// Use `number` only when getting values out of DB
// Otherwise, Date is preferred.
export type DateLike = number | Date;

export namespace SparkletDB {

	export type TimestampIntoDate<T extends RowDataPacket> = {
		[k in keyof T]: (
			T[k] extends number ? string:
				T[k] extends object
				? TimestampIntoDate<T[k]>
				: T[k]
		);
	};
	
	export interface SparkletUser<D extends DateLike>
		extends RowDataPacket {
		
		uuid:			string,
		name:			string,
		passHash:		string,
		date:			D,
		adminRank:		number,
		emailVerified:	boolean,
		emailVToken?:	string,
		authToken?:		string,
		pfpSrc?:		string,
		bio?:			string,
	}

	export type SparkletUserPublic<D extends DateLike> =
		Omit<SparkletUser<D>, "passHash" | "emailVToken" | "authToken">;
	
	export interface Capsule<D extends DateLike>
		extends RowDataPacket {

		uuid:		string;
		name:		string;
		creator:	string;
		version:	string;
		content:	string;
		visible:	boolean;
		date:		D;
		likes:		number;
	}
	
	export interface NewsPost<D extends DateLike>
		extends RowDataPacket {

		uuid:		string;
		title:		string;
		author:		string;
		content:	string;
		visible:	boolean;
		date:		D;

//		possible new feature?
//		likes:		number;
	}

	export interface Spark<D extends DateLike>
		extends RowDataPacket {
		
		uuid:			string;
		title:			string;
		creator:		string;
		description:	string;
		visible:		boolean;
		date:			D;
	}
}
