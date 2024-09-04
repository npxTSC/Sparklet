import { Router } from "express";
import { accounts } from "./api/accounts.js";

import db from "./db.js";

const CHICKEN_WINGS_URL = "https://sparklet.org/img/tea-cape.png";

const api = Router();
api.use("/accounts", accounts);

api.get("/tea-capes", (_, res) => { // TODO admin portal for changing capes
    res.json({
        "Cherry_Flanger": CHICKEN_WINGS_URL,
        "4772c57f-ca43-440c-be84-d5a97b676792": CHICKEN_WINGS_URL,

        "Epsilon094": CHICKEN_WINGS_URL,
        "8a7809c5-8351-4322-8f3f-6b5abce09c81": CHICKEN_WINGS_URL,

        "III_zP0_III": CHICKEN_WINGS_URL,
        "8d5fdde6-9ae9-480b-9cf2-30167933a10e": CHICKEN_WINGS_URL,
    });
});

api.get("/profile/pfp", async (req, res) => {
    const { _uuid } = req.query;

    return res.redirect("/pfps/deft.png");
});

api.get("/dbg-list-users", async (_req, res) => {
    const users = await db.unsafe.listUsers();
    return res.json(users);
});

export default api;
