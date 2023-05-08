export {config as loadEnv}		from "dotenv";
import { HasDateLike, Option }	from "./classes.js";

export function checkEnvReady(requiredVars: string[]) {
	for (let v of requiredVars) {
		if (typeof process.env[v] !== "string") {
			throw new Error(`Check your .env file... "${v}" is missing.`);
		} else {
			console.log(`Env ${v} loaded...`);
		}
	}
}

export function dateify<T extends Option<HasDateLike>>(obj: T) {
	if (typeof obj === "undefined") return;

	const nobj = obj;
	nobj.date = new Date((obj.date as number) * 1000);

	return nobj;
}
