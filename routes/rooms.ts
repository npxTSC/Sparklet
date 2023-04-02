"use strict";

import Express					from "express";
import { findRoom, throw404 }	from "../app";

const router			= Express.Router();

router.get("/quiz", (req, res) => {
	res.render("quiz");
});

router.get("/stratus", (req, res) => {
	res.render("stratus");
});

/*router.get("/rooms/breakout", (req, res) => {
	res.render("breakout");
});*/

router.get("/quiz/:room", (req, res) => {
	const room = findRoom(req.params.room);

	// Guard clause for invalid inputs
	if (!room) return throw404(res);
	
	res.render("quizplay", {room: room});
});

export default router;
