"use strict";

import { AdminRank }	from "./classes.js";
import path				from "path";

export const PORT				= 3000;
export const MAX_FILE_UPLOAD_MB	= 200;
export const QP_NAME_LIMIT		= 20;
export const BIO_CHAR_LIMIT		= 400;
export const GITHUB_PAGE		= "https://github.com/Lamby777/SparkletX";
export const AUTH_TOKEN_BITS	= 256;
export const STATEFUL			= path.resolve("/var/lib/sparklet");
export const sparksFolder		= path.resolve(STATEFUL, "sparks");

export const ADMINS				= {
	"Mira":			AdminRank.Operator,		// Root
	"zP":			AdminRank.Manager,		// Sh33p
	"Anonymous":	AdminRank.Conductor,	// Reserved for default name
};
