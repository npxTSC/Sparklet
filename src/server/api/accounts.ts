import { Router } from "express";
export const accounts = Router();

accounts.post("/login", (req, res) => {
    const { username, password, loginAction } = req.body;
    if (!username || !password) return res.status(400).end();
});

accounts.get("/by-uuid", async (req, res) => {
    const { uuid } = req.query;
});

accounts.get("/session-self", async (req, res) => {
    const { session } = req.cookies;
    if (!session) return res.status(401).end();

    const user = await db.getUserBySessionToken(session);
});

