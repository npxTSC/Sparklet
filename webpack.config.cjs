"use strict";
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const cd = __dirname;

const tsEntries = glob.sync("src/js/*.ts").map(v => path.parse(v).name);
// const sassEntries = glob.sync("src/css/*.scss").map(v => path.parse(v).name);

const entries = tsEntries.reduce((entries, name) => {
    const outTS = `${cd}/src/js/${name}.ts`;
    const outSass = `${cd}/src/css/${name}.scss`;

    const entry = [
        outTS,
    ]

    if (fs.existsSync(outSass)) entry.push(outSass);

    entries[name] = entry;

    return entries;
}, {});

module.exports = {
    mode: "production",
    entry: entries,

    output: {
        filename: "js/[name].js",
        path: cd + "/dist",
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "css/[name].min.css",
                            context: "src/css/",
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.webpack.json"
                    }
                }],
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: [".scss", ".tsx", ".ts", ".js"],
    },

    plugins: [
        new CleanTerminalPlugin(),
        new webpack.ProgressPlugin(),

        new CopyPlugin({
            patterns: [
                {
                    from: path.join(cd + "/src/public"),
                    to: path.join(cd + "/dist/public"),
                },
            ],
        }),
    ],

    experiments: {
        topLevelAwait: true
    },
}
