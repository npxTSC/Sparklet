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

export default router;
