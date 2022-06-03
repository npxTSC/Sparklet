import {Keyable}	from "../classes";

declare global {
	namespace Express {
		interface Request {
			account: Keyable<string>;
		}
	}
}