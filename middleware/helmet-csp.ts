import crypto from "crypto";
import helmet from "helmet";
import { NextFunction, Request, Response } from "express";

export default async function(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.locals.nonce = crypto.randomBytes(16).toString("base64");

    const middleware = helmet.contentSecurityPolicy({
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": [
                "'self'",
                "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js",
                `'nonce-${res.locals.nonce}'`,
            ],
        },
    });

    middleware(req, res, next);
}
