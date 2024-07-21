import express from "express";
import ViteExpress from "vite-express";

import api from "./api.js";

const app = express();

app.get("/hello", (_, res) => {
    res.send("Hello Vite + Vue + TypeScript!");
});

// app.use("/.well-known", routes.wk);
app.use("/api", api);


ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
