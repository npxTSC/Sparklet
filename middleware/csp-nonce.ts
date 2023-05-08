import crypto from "crypto";
import {
	Request,
	Response,
	NextFunction
} from "express";

export default async function(
	req:	Request,
	res:	Response,
	next:	NextFunction
) {
	const nonce		= crypto.randomBytes(16).toString("base64");
	const oldHeader	= res.getHeader("Content-Security-Policy");

	res.setHeader("Content-Security-Policy",
		oldHeader ? `${oldHeader} nonce-${nonce}` :
		`script-src 'nonce-${nonce}'`
	);

	res.locals.nonce = nonce;
	next();
}
