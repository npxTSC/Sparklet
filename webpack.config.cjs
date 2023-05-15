"use strict";
const path					= require("path");
const CleanTerminalPlugin	= require("clean-terminal-webpack-plugin");
const CopyPlugin			= require("copy-webpack-plugin");

const cd = __dirname;

module.exports = {
	mode: "production",
	entry: {
		"main":				cd + "/src/js/main.ts",
		"login":			cd + "/src/js/login.ts",
		"quiz":				cd + "/src/js/quiz.ts",
		"quizplay":			cd + "/src/js/quizplay.ts",
		"stratus":			cd + "/src/js/stratus.ts",
		"pets":				cd + "/src/js/pets.ts",
		"capsules":			cd + "/src/js/capsules.ts",
		"host-room":		cd + "/src/js/host-room.ts",
		
		"sass-main":		cd + "/src/css/main.scss",
		"sass-pets":		cd + "/src/css/pets.scss",
		"sass-quizplay":	cd + "/src/css/quizplay.scss",
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
							outputPath: "css/",
							name: "[path][name].min.css",
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
	
	output: {
		filename: "js/[name].js",
		path: cd + "/dist",
	},

	plugins: [
		new CleanTerminalPlugin(),
		
		new CopyPlugin({
			patterns: [
				{
					from:	path.join(cd + "/src/public"),
					to:		path.join(cd + "/dist/public"),
				},
			],
		}),
	],			

	experiments: {
		topLevelAwait: true
	},
}
