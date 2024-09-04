import express from "express";
import ViteExpress from "vite-express";
import cookieParser from "cookie-parser";
import fs from "fs";
import { createServer as createViteServer } from 'vite'
import path from 'path';
import { fileURLToPath } from 'url';

import db from "./db.js";
import api from "./api.js";
import { APP_FOLDER } from "./consts.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
fs.mkdirSync(APP_FOLDER, { recursive: true });
const app = express();

// app.use(gzipCompression());
// app.use(fileUpload({
//     limits: { fileSize: MAX_FILE_UPLOAD_MB * 1024 * 1024 },
// }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
});

app.use(vite.middlewares);

app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
        let template = fs.readFileSync(
            path.resolve(__dirname, '../client/index.html'),
            'utf-8',
        )

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
        //    and also applies HTML transforms from Vite plugins, e.g. global
        //    preambles from @vitejs/plugin-react
        template = await vite.transformIndexHtml(url, template)

        // 3. Load the server entry. ssrLoadModule automatically transforms
        //    ESM source code to be usable in Node.js! There is no bundling
        //    required, and provides efficient invalidation similar to HMR.
        const { render } = await vite.ssrLoadModule('/src/entry-server.js')

        // 4. render the app HTML. This assumes entry-server.js's exported
        //     `render` function calls appropriate framework SSR APIs,
        //    e.g. ReactDOMServer.renderToString()
        const appHtml = await render(url)

        // 5. Inject the app-rendered HTML into the template.
        const html = template.replace(`<!--ssr-outlet-->`, appHtml)

        // 6. Send the rendered HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
        // If an error is caught, let Vite fix the stack trace so it maps back
        // to your actual source code.
        vite.ssrFixStacktrace(e)
        next(e)
    }
});

// app.use("/.well-known", routes.wk);
app.use("/api", api);

ViteExpress.listen(app, 3000, () =>
    console.log("Listening on port 3000..."),
);
