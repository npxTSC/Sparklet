const path = require("path");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');
const cd = path.resolve(__dirname);

module.exports = {
	mode: "development",
	entry: {
		"main":		cd + "/src/js/main.ts",
		"login":	cd + "/src/js/login.ts",
		"quiz":		cd + "/src/js/quiz.ts",
		"quizplay":	cd + "/src/js/quizplay.ts",
		"wordle":	cd + "/src/js/wordle.ts",
		
		"bootstrap.min":	cd + "/src/js/bootstrap.min.js",
		"sass-main":		cd + "/src/css/main.scss",
		"sass-quizplay":	cd + "/src/css/quizplay.scss",
		"sass-wordle":		cd + "/src/css/wordle.scss",
	},
	
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'css/',
							name: '[name].min.css'
						}
					},
					'sass-loader'
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

	plugins: [new CleanTerminalPlugin()]
}
