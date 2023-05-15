// Middleware to add account data to req
"use strict";

import {db}				from "../db.js";
import {MaybeNullish}	from "../classes.js";

import {
	Request,
	Response,
	NextFunction
} from "express";

export default async function(
	req:	Request,
	res:	Response,
	next:	NextFunction
) {
	const user = req.cookies?.user		as MaybeNullish<string>;
	const token = req.cookies?.luster	as MaybeNullish<string>;

	res.locals.account = null;
	if (!user || !token) return next();

	const row = await db.verifyLoginTokenWithName(user, token);
	if (!row) return next();

	res.locals.account = await db.getUser(user);
	return next();
}
