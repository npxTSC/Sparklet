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
	const uuid = req.cookies?.uuid		as MaybeNullish<string>;
	const token = req.cookies?.luster	as MaybeNullish<string>;

	res.locals.account = null;
	if (!uuid || !token) return next();

	res.locals.account = await db.verifyLoginToken(uuid, token) ?? null;
	return next();
}
