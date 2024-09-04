import { homedir } from "os";
import path from "path";

// for testing purposes...
export const ANON_PASSWORD = "asdf";
export const AUTH_TOKEN_LEN = 128;

export const HOME_DIR = homedir();
export const APP_FOLDER = process.env.NODE_ENV === "production" ? "/srv/sparklet/" :
    path.join(HOME_DIR, "sparklet/");
export const DB_PATH = path.join(APP_FOLDER, "sparklet.db");

