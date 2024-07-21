import { Router } from "express";

import db from "./db.js";

const CHICKEN_WINGS_URL = "https://sparklet.org/img/tea-cape.png";

const router = Router();

router.get("/tea-capes", (_, res) => {
    // TODO admin portal for changing capes
    res.json({
        "Cherry_Flanger": CHICKEN_WINGS_URL,
        "4772c57f-ca43-440c-be84-d5a97b676792": CHICKEN_WINGS_URL,

        "Epsilon094": CHICKEN_WINGS_URL,
        "8a7809c5-8351-4322-8f3f-6b5abce09c81": CHICKEN_WINGS_URL,

        "III_zP0_III": CHICKEN_WINGS_URL,
        "8d5fdde6-9ae9-480b-9cf2-30167933a10e": CHICKEN_WINGS_URL,
    });
});

router.get("/accounts/:id", (req, res) => {
    const acc = db.getAccountByUUID(req.params.id);
    res.json(acc);

    // res.json({
    //     "uuid": "4772c57f-ca43-440c-be84-d5a97b676792",
    //     "username": "Cherry_Flanger",
    //     "date_joined": "1721577153000",
    //     "rank": 1,
    // })
});

router.post("/accounts/register/", (req, res) => {
    // TODO implement account registration
    // const { username, password, } = req.body;
});


export default router;
