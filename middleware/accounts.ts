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

	req.account = null;
	if (!user) return next();

	const row = db.prepare(`
		SELECT name, pfpUuid
		FROM users
		WHERE name = (?) AND authToken = (?);
	`).get(user, token);

	if (!row) return next();
	
	req.account = row;
	return next();
}