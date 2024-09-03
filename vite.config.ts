import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src/client",
    plugins: [vue()],
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/client/index.html'),
                sparks: resolve(__dirname, 'src/client/sparks/index.html')
            }
        }
    }
});
