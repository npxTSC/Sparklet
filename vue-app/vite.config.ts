import { fileURLToPath, URL } from "node:url";
import mpa from 'vite-plugin-mpa';

import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                about: resolve(__dirname, "pages/about/index.html"),
            },
        },
    },

    plugins: [
        vue(),
        // mpa(),
    ],

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "~bootstrap": resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
});
