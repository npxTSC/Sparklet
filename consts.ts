"use strict";

import { AdminRank }		from "./classes.js";

export const PORT			= 3000;
export const QP_NAME_LIMIT	= 20;
export const GITHUB_PAGE	= "https://github.com/Lamby777/SparkletX";
export const ADMINS			= {
	"Mira":			AdminRank.Operator,		// Root
	"zP":			AdminRank.Manager,		// Sh33p
	"Anonymous":	AdminRank.Conductor,	// Reserved for default name
};
