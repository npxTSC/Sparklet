const path = require("path");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const cd = path.resolve(__dirname);

module.exports = {
	mode: "development",
	entry: {
		"main":		cd + "/src/js/main.ts",
		"login":	cd + "/src/js/login.ts",
		"quiz":		cd + "/src/js/quiz.ts",
		"quizplay":	cd + "/src/js/quizplay.ts",
		"capsules":	cd + "/src/js/capsules.ts",
		
		"bootstrap.min":	cd + "/src/js/bootstrap.min.js",
		"sass-main":		cd + "/src/css/main.scss",
		"sass-quizplay":	cd + "/src/css/quizplay.scss",
		
		"sparks/sparkwave":	cd + "/src/js/sparks/sparkwave/main.ts",
		"sass-sparkwave":	cd + "/src/css/sparks/sparkwave.scss",
		
		"sparks/wordle":	cd + "/src/js/sparks/wordle/main.ts",
		"sass-wordle":		cd + "/src/css/sparks/wordle.scss",
	},
	
	module: {
		rules: [
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
					loader: 'ts-loader',
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
	]
}
