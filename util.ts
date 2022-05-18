// Module for both client and server
"use strict";

import {Keyable}	from "./classes";

export function filterStrings(	str: string,
								filtered: string[]) {
	let res = str;
	filtered.forEach((v) => {
		res = res.replaceAll(v, "");
	});

	return res;
}

export function filterStringE(	str: string,
								include: string[]) {
	const inter = Array.from(str);
	const filtered = inter.filter(ch => include.includes(ch));
	
	return filtered.join("");
}

export function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max-min+1))+min;
}

export function shakeElement(	element:		HTMLElement,
								time:			number,
								coefficient:	number ) {
	element.style.transition = "0.1s";

	const oldTransform = element.style.transform;

	const inter = setInterval(() => {
		const [r1, r2, r3] = [
			randInt(1, 4),
			randInt(1, 4),
			randInt(1, 3),
		];

		const [p1, p2, p3] = [
			(r1 % 2) === 0 ? "" : "-",
			(r2 % 2) === 0 ? "" : "-",
			(r3 % 2) === 0 ? "" : "-",
		];

		const transitionX	= (parseInt(p1 + r1, 10)
							* (coefficient / 10)) + "em";
		const transitionY	= (parseInt(p2 + r2, 10)
							   * (coefficient / 10)) + "em";
		const rotate		= (parseInt(p3 + r3, 10)
							   * (coefficient / 10)) + "deg";

		element.style.transform =
			`translate(${transitionX},${transitionY}) rotate(${rotate})`;  
	}, 70);

	setTimeout(() => {
		element.style.transform = oldTransform;  
		clearInterval(inter);
	}, time);
}

// Cookie Parser/Editor
export namespace cmon {
	export function remove(key: string, cpath?: string) {
		return `${key}=; Max-Age=-99999999; path=${cpath ?? "/"}`;
	}
	
	export function assignment(key: string, val: string,
							options?: CookieOptions) {
		return (
			`${key}=${val}; `+
			`expires=${options?.expiry ?? "Fri, 31 Dec 9999 23:59:59 GMT"};`+
			`SameSite=${options?.xorigin ?? "Lax"};`+
			`${options?.secure ? "Secure;" : ""}`+
			`path=${options?.path ?? "/"}`
		);
	}
	
	export function read(cstr: string, key: string): string {
		return parse(cstr)[key];
	}

	export function parse(cstr: string): Keyable<string> {
		const split = cstr.split(";").map((v) => v.trim());

		let res: Keyable<string> = {}

		split.forEach((v) => {
			const kv: string[] = v.split("=");
			res[kv[0]] = kv[1];
		});
		
		return res;
	}
}

interface CookieOptions {
	secure?:		true;
	strict?:	true;
	xorigin?:	"Secure" | "Lax" | "None";
	expiry?:	string;
	path?:		string;
}
