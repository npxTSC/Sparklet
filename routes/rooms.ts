"use strict";

import Express from "express";
import { findRoom, throw404 } from "../app.js";

const router = Express.Router();

router.get("/quiz", (_, res) => {
    res.render("quiz");
});

router.get("/chat", (_, res) => {
    res.render("justchat");
});

router.get("/stratus", (_, res) => {
    res.render("stratus");
});

/*router.get("/breakout", (req, res) => {
    res.render("breakout");
});*/

router.get("/quiz/:room", (req, res) => {
    const room = findRoom(req.params.room);
    if (!room) return throw404(res);

    res.render("quizplay", { room: room });
});

export default router;
