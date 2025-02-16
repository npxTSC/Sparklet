import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    root: "src/client",
    plugins: [vue()],

    resolve: {
        alias: {
            "~bootstrap": resolve(__dirname, "node_modules/bootstrap"),
        }
    },

    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ["mixed-decls", "color-functions", "global-builtin", "import"]
            },
        }
    },

    esbuild: {
        supported: {
            "top-level-await": true,
        },
    },

    build: {
        rollupOptions: {
            input: {
                "main": resolve(__dirname, "src/client/index.html"),
                "about": resolve(__dirname, "src/client/about/index.html"),
                "pets": resolve(__dirname, "src/client/pets/index.html"),
                "login": resolve(__dirname, "src/client/login/index.html"),
                "sparks": resolve(__dirname, "src/client/sparks/index.html"),
                "portfolio": resolve(__dirname, "src/client/portfolio/index.html"),
                "conductors": resolve(__dirname, "src/client/conductors/index.html"),
                "sparks/speedrun-wordle": resolve(__dirname, "src/client/sparks/speedrun-wordle/index.html"),
                "sparks/sparkwave": resolve(__dirname, "src/client/sparks/sparkwave/index.html"),
                "sparks/sheep-clicker": resolve(__dirname, "src/client/sparks/sheep-clicker/index.html"),
                "sparks/rainbow-l": resolve(__dirname, "src/client/sparks/rainbow-l/index.html"),
            }
        }
    }
});
