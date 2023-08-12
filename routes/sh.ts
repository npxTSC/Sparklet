"use strict";

import Express from "express";

const router = Express.Router();

router.get("/", async (_, res) => {
  res.redirect("/sparks/");
});

export default router;
