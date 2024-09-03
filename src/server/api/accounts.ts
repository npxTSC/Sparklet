"use strict";

import { Router } from "express";
import db from "../db.js";

export const accounts = Router();

accounts.post("/login", async (req, res) => {
    const { username, password, loginAction } = req.body;
    if (!username || !password) return res.status(400).end();

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

            break;

        case "log out":
            res.clearCookie("session");
            break;

        default:
            return res.status(400).json({
                error: "Invalid login action."
            });
    }

    res.status(200).end();
});

accounts.get("/by-uuid", async (req, res) => {
    const { uuid } = req.query;
});

accounts.get("/session-self", async (req, res) => {
    const { session } = req.cookies;
    if (!session) return res.status(401).end();

    const user = await db.getUserBySessionToken(session);
});

