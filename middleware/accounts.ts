// Middleware to add account data to req
"use strict";

import db		from "../db";

import {
	Request,
	Response,
	NextFunction
} from "express";

export default function middleware(	req:	Request,
									res:	Response,
									next:	NextFunction) {

	const user = req.cookies?.user;
	const token = req.cookies?.luster;

	res.locals.account = null;
	if (!user) return next();

	const row = db.prepare(`
		SELECT name FROM users
		WHERE name = (?) AND authToken = (?);
	`).get(user, token);

	if (!row) return next();
	
	res.locals.account = row;
	return next();
}