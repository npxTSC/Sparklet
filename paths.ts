/*
 * this is separate from `consts.ts` because webpack is
 * big dumb and can't just ignore the `path` module when
 * I'm not using anything related to it
 */
"use strict";
import path from "path";

export const STATEFUL = path.resolve("/srv/sparklet");
export const SPARKS_FOLDER = path.resolve(STATEFUL, "sparks");
