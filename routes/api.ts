"use strict";

import Express from "express";
import db from "../db.js";
import { AdminRank, SparkletDB } from "../classes.js";
import { bioFilter } from "../feutils.js";

const router = Express.Router();
const CHICKEN_WINGS_URL = "https://i.imgur.com/95Awa6y.png";

router.get("/capsules", (req, res) => {
  let rows;

  if (req.query.q) {
    const spaced = (<string> req.query.q).replace(/\+/g, " ");
    const searchQuery = decodeURIComponent(spaced);
    rows = db.searchCapsules(searchQuery);
  } else {
    rows = db.capsuleQPosts();
  }

  return res.status(200).json(rows);
});

router.get("/tea-capes", (_, res) => {
  // TODO admin portal for changing capes
  res.json({
    "Mira_Serenade": CHICKEN_WINGS_URL,
    "4772c57f-ca43-440c-be84-d5a97b676792": CHICKEN_WINGS_URL,

    "Epsilon094": CHICKEN_WINGS_URL,
    "8a7809c5-8351-4322-8f3f-6b5abce09c81": CHICKEN_WINGS_URL,

    "III_zP0_III": CHICKEN_WINGS_URL,
    "8d5fdde6-9ae9-480b-9cf2-30167933a10e": CHICKEN_WINGS_URL,
  });
});

router.post("/profile-mod/bio", (req, res) => {
  const { newBio, uuid: targetUUID } = req.body;

  if (res.locals.account === null || !newBio) {
    return res.status(400).end();
  }

  const acc = res.locals.account as SparkletDB.SparkletUser;

  if (acc.uuid !== targetUUID && acc.adminRank < AdminRank.Manager) {
    // must be Manager+ to edit bios of other users
    return res.status(403).end();
  }

  db.updateBio(targetUUID, bioFilter(newBio));

  return res.status(200).end();
});

export default router;
