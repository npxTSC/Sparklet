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

// Cookie Parser/Editor
export class CookieMonster {
	constructor(private $doc: () => Document) {}
	
	setDocument(ptr: () => Document) {
		this.$doc = ptr;
	}
	
	async setCookie(key: string, val: string) {
		this.$doc().cookie = `
			${key}=${val}
			expires=Fri, 31 Dec 9999 23:59:59 GMT;
			SameSite=Strict;
			Secure;
			path=/
		`;
	}
	
	getCookie(key?: string): string {
		return this.parse()[key];
	}

	parse(): Keyable<string> {
		const str = this.$doc().cookie;
		const split = str.split(";").map((v) => v.trim());

		let res: Keyable<string> = {}

		split.forEach((v) => {
			const kv: string[] = v.split("=");
			res[kv[0]] = kv[1];
		});
		
		return res;
	}
}
