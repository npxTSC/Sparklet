/*
frontend shit

again, webpack won't let me import from util.ts
without including all the backend stuff, despite
me not even using those, so yea here we are

all the util stuff that doesn't require backend
modules and still gets used in both frontend and
backend belongs here
*/
"use strict";

import { BIO_CHAR_LIMIT, DEFAULT_BIO } from "./consts.js";

export function bioFilter(bio: string, defaults?: true): string;
export function bioFilter(bio: string, defaults: false): string | null;
export function bioFilter(bio: string, defaults: boolean = true) {
  const filtered = bio.substring(0, BIO_CHAR_LIMIT).trim();
  return filtered || (defaults ? DEFAULT_BIO : null);
}
