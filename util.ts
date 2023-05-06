export {config as loadEnv}	from "dotenv";

export function checkEnvReady(requiredVars: string[]) {
	const ENV_READY = requiredVars.every(
		v => typeof process.env[v] === "string"
	);

	if (!ENV_READY) {
		throw new Error("Check your .env file... Some data is missing.");
	}
}
