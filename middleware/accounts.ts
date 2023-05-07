// Middleware to add account data to req
"use strict";

import {db}		from "../db.js";

import {
	Request,
	Response,
	NextFunction
} from "express";

export default async function middleware(
	req:	Request,
	res:	Response,
	next:	NextFunction
) {
	const user = req.cookies?.user;
	const token = req.cookies?.luster;

	res.locals.account = null;
	if (!user) return next();

	const row = await db.verifyLoginToken(user, token);
	if (!row) return next();

	res.locals.account = await db.getUser(user);
	return next();
}
