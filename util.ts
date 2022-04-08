// Module for both client and server
"use strict";

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