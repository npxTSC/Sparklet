const path = require("path");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
	mode: "development",
	entry: {
		"main":		path.resolve(__dirname) + "/src/js/main.ts",
		"quiz":		path.resolve(__dirname) + "/src/js/quiz.ts",
		"quizplay":	path.resolve(__dirname) + "/src/js/quizplay.ts",
		
		"bootstrap.min":
			path.resolve(__dirname) + "/src/js/bootstrap.min.js",
		
		"sass":
			path.resolve(__dirname) + "/src/css/main.scss",
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
		path: path.resolve(__dirname) + "/dist",
	},

	plugins: [new CleanTerminalPlugin()]
}
