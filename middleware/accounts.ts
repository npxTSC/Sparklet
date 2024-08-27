// Middleware to add account data to req
"use strict";

import { db } from "../db.js";
import { Option } from "../classes.js";

import { NextFunction, Request, Response } from "express";

export default async function(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const uuid = req.cookies?.uuid as Option<string> | undefined;
    const token = req.cookies?.luster as Option<string> | undefined;

    res.locals.account = null;
    if (!uuid || !token) return next();

    res.locals.account = await db.unsafe.verifyLoginToken(uuid, token) ?? null;
    return next();
}
