// Middleware to add account data to req
"use strict";

import { NextFunction, Request, Response } from "express";

import { __dirname } from "../app.js";
import path from "path";

export default async function(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    res.locals.viewsFolder = path.join(__dirname, "views");
    return next();
}
