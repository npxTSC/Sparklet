// Middleware to add account data to req
"use strict";

import { db } from "../db.js";
import { Nullable } from "../classes.js";

import { NextFunction, Request, Response } from "express";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const uuid = req.cookies?.uuid as Nullable<string> | undefined;
  const token = req.cookies?.luster as Nullable<string> | undefined;

  res.locals.account = null;
  if (!uuid || !token) return next();

  res.locals.account = await db.verifyLoginToken(uuid, token) ?? null;
  return next();
}
