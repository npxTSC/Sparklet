"use strict";

import Express		from "express";
import statements	from "../statements";

const router = Express.Router();

router.get("/capsules", (req, res) => {
	let rows;
	
	if (req.query.q) {
		const spaced = (<string>req.query.q).replace(/\+/g, " ");
		const searchQuery = decodeURIComponent(spaced);
		rows = statements.searchCapsules.all(searchQuery);
	} else {
		rows = statements.capsuleQPosts.all();
	}
	
	return res.status(200).json(rows);
});


router.get("/tea-capes", (req, res) => {
	// TODO admin portal for changing capes
	res.json({
		"4772c57f-ca43-440c-be84-d5a97b676792":
			"https://user-images.githubusercontent.com/10100202/203159684-08e62b4d-3b63-4f39-a4fc-21fc4960f346.png"
	})
});

export default router;
