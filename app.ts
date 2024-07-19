"use strict";

// Modules
import Express from "express";
import crypto from "crypto";
import cparse from "cookie-parser";
import bcrypt from "bcrypt";
import path from "path";
import http from "http";
import { Server as ioServer } from "socket.io";
import { rand, str } from "libdx";
import gzipCompression from "compression";
import fs from "fs";
import sanitize from "sanitize-filename";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import "ejs";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

util.loadEnv();

// Local Modules
import { AdminRank, Room } from "./classes.js";
import { AUTH_TOKEN_BITS, MAX_FILE_UPLOAD_MB, PORT } from "./consts.js";
import { sparksFolder, STATEFUL } from "./paths.js";
import db from "./db.js";
import accountParser from "./middleware/accounts.js";
import pathsSupplier from "./middleware/paths.js";
import helmetCsp from "./middleware/helmet-csp.js";
import { QUIZ_SOCKET_HANDLERS } from "./quiz-utils.js";
import * as routes from "./routes/all.js";
import * as util from "./util.js";

// App
export const app = Express();
export const activeRooms: Room[] = [];
const server = http.createServer(app);
const io = new ioServer(server);

// Middleware
app.use(
    rateLimit({
        // 600 requests per minute allowed
        windowMs: 60_000,
        max: 600,

        // Return rate limit info in the `RateLimit-*` headers
        standardHeaders: true,
    }),
);

app.use(cparse());
app.use(helmetCsp);
app.use(accountParser);
app.use(pathsSupplier);
app.use(gzipCompression());
app.use(fileUpload({
    limits: { fileSize: MAX_FILE_UPLOAD_MB * 1024 * 1024 },
}));
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(path.join(__dirname, "dist")));
app.use(Express.static(path.join(__dirname, "dist/public")));
app.use(Express.static(STATEFUL));

// App config
app.locals.Ranks = AdminRank;
app.set("view engine", "ejs");

app.use((req, _, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(`${req.method} @ ${req.originalUrl}\n^^^ from ${ip}\n`);
    next();
});

// Routes
app.get("/", (_, res) => {
    res.render("home");
});

// robots.txt -> /public/robots.txt
app.get("/robots.txt", (_, res) => {
    res.sendFile(path.join(__dirname, "dist/public/robots.txt"));
});

app.get("/info(/*)?", (_, res) => {
    res.render("sussy");
});

app.get("/pets", (_, res) => {
    res.render("pets-info");
});

app.get("/about", (_, res) => {
    res.render("about");
});

app.use("/rooms", routes.rooms);
app.use("/.well-known", routes.wk);
app.use("/api", routes.api);
app.use("/cpl", routes.adminCpl);

app.get("/host-room/:rid", (_, res) => {
    return res.render("host-room");
});

app.get("/login", (_, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const {
        username: user,
        password: pass,
        loginAction: action,
    } = req.body;

    // Empty usernames, specially crafted requests with missing fields, etc.
    if (
        action !== "Log Out" &&
        [user, pass, action].some(
            (v) => (typeof v === "undefined" || v.length === 0),
        )
    ) {
        return fail("l-noInput");
    }

    if (str.containsSpecials(user)) return fail("l-specialChars");
    if (user.length > 30) return fail("l-tooLong");
    if (pass.length > 100) return fail("l-passTooLong");

    let row = await db.getUser(user);

    switch (action) {
        case "Register":
            // Opposite of login, reject if exists
            if (row) return fail("r-nameExists");

            await db.register(user, pass);

            console.log(`New account created: ${user}`);

            // Reassign row to new user object
            row = await db.getUser(user);

        // Fall-through to Login, because let's be real,
        // it's fucking annoying when you need to log in
        // after registering on a site ¯\_(ツ)_/¯

        case "Log In":
            // If username not found, reject early
            if (!row) return fail("l-nameNotFound");

            // Compare password to hash
            const correct = await bcrypt.compare(pass, row.passHash);

            // If password is wrong, reject
            if (!correct) return fail("l-wrongPassword");

            // Password is correct
            console.log(`User ${user} logged in successfully`);

            // Change login token in DB
            const token = await makeNewTokenFor(row.uuid);

            res.cookie("uuid", row.uuid, { secure: true, httpOnly: true });
            res.cookie("luster", token, { secure: true, httpOnly: true });
            res.redirect("/conductors/" + user.toLowerCase());

            break;

        case "Log Out":
            // Remove auth cookie stuff
            res.cookie("uuid", null, { secure: true, httpOnly: true });
            res.cookie("luster", null, { secure: true, httpOnly: true });

            return res.redirect("/login");

        default:
            // Malformed requests should be rejected
            res.status(400);
            return res.send("Use the form correctly pls :)");
    }

    function fail(code: string) {
        console.log(`Failed "${action}" on ${user}`);
        res.redirect("/login?ecode=" + code);
    }
});

app.get("/conductors/:profile", async (req, res) => {
    const { profile } = req.params;
    const user = res.locals.account;

    console.log(
        `${user?.name ?? "<Anon>"} requested profile of "${profile}"`,
    );

    if (str.containsSpecials(profile)) return throw404(res);

    let row = await db.getUser(profile);

    if (!row) return throw404(res);

    return res.render("profile", {
        profileInfo: row,
    });
});

app.get("/news/:PostID", async (req, res) => {
    let postId = req.params["PostID"];
    if (typeof postId !== "number" || isNaN(postId)) {
        return throw404(res);
    }

    let post = await db.getNews(postId);

    if (!post) return throw404(res);

    let passed = {
        postId: postId,
        post: post,
    };

    res.render("article", passed);
});

app.get("/news", async (_, res) => {
    let qposts = await db.newsQPosts();
    res.render("news", { qposts });
});

app.get("/sparks/:SparkUUID", async (req, res) => {
    let sparkUUID = req.params["SparkUUID"];
    if (!sparkUUID) return throw404(res);

    sparkUUID = sanitize(sparkUUID);

    let post = await db.getGame(sparkUUID);

    if (!post) return throw404(res);

    let passed = {
        postId: sparkUUID,
        post: post,
    };

    res.render(`${sparksFolder}/${sparkUUID}/main`, passed);
});

app.get("/sparks", async (_, res) => {
    const qposts = await db.gameQPosts();

    res.render("catalog", { qposts });
});

// 404 other routes
app.get("*", (_, res) => throw404(res));

// Socket.IO handlers
io.on("connection", (socket) => {
    //socket.on("disconnect", () => {});

    socket.on("quizHostAction", QUIZ_SOCKET_HANDLERS.quizHostAction(socket));
    socket.on("queryRoom", QUIZ_SOCKET_HANDLERS.queryRoom(socket));
    socket.on("joinRoom", QUIZ_SOCKET_HANDLERS.joinRoom(socket));
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});

// Functions
export function throw404(res: Express.Response) {
    res.status(404);
    res.render("404");
}

export function generateToken(len: number) {
    return crypto.randomBytes(len).toString("hex");
}

export function findRoom(code: string) {
    return activeRooms.find((v) => v.joinHash === code);
}

async function makeNewTokenFor(uuid: string) {
    const token = generateToken(AUTH_TOKEN_BITS);

    await db.editLoginToken(uuid, token);
    return token;
}
