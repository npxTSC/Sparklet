export { config as loadEnv } from "dotenv";

export function checkEnvReady(requiredVars: string[]) {
    for (let v of requiredVars) {
        if (typeof process.env[v] !== "string") {
            throw new Error(`Check your .env file... "${v}" is missing.`);
        } else {
            console.log(`Env ${v} loaded...`);
        }
    }
}
