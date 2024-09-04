import express from "express";
import ViteExpress from "vite-express";
import cookieParser from "cookie-parser";
import fs from "fs";

import { APP_FOLDER } from "./consts.js";

import db from "./db.js";
import api from "./api.js";

const app = express();

// app.use(gzipCompression());
// app.use(fileUpload({
//     limits: { fileSize: MAX_FILE_UPLOAD_MB * 1024 * 1024 },
// }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/.well-known", routes.wk);
app.use("/api", api);

ViteExpress.listen(app, 3000, () =>
    console.log("Listening on port 3000..."),
);
