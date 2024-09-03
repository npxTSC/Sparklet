"use strict";

import { Router } from "express";
import db from "../db.js";

export const accounts = Router();

accounts.post("/login", async (req, res) => {
    const { username, password, loginAction } = req.body;
    if (loginAction !== "log out" && (!username || !password)) return res.status(400).end();

    console.log(`${username} is attempting to ${loginAction}.`);

    switch (loginAction) {
        case "register":
            if (await db.getUser(username)) return res.status(409).json({
                error: "Username already exists."
            });

            db.register(username, password);

        // fallthrough to login
        case "log in":
            const user = await db.getUser(username);
            if (!user) return res.status(404).json({
                error: "User not found."
            });

            const token = await db.userLogin(username, password);

            res.cookie('session', token, { maxAge: 604800, httpOnly: true });

            res.json({
                account: user,
            });

            break;

        case "log out":
            res.clearCookie("session");
            res.json({});
            break;

        default:
            return res.status(400).json({
                error: "Invalid login action."
            });
    }

    console.log(`\\- ${username} was successful!`);
    res.status(200).end();
});

accounts.get("/by-uuid", async (req, res) => {
    const { uuid } = req.query;
});

accounts.get("/session-self", async (req, res) => {
    const { session } = req.cookies;
    if (!session) return res.status(401).end();

    const user = await db.getUserBySessionToken(session);
    if (!user) return res.status(401).end();

    return res.json({
        account: user,
    });
});

