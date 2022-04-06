const path = require("path");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = {
	mode: "development",
	entry: [
		path.resolve(__dirname) + "/src/js/main.ts",
		path.resolve(__dirname) + "/src/js/quiz.ts",
		path.resolve(__dirname) + "/src/css/main.scss",
	],
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				/*use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader",
				],*/
				use: [
					{
						loader: 'file-loader',
						options: { outputPath: 'css/', name: '[name].min.css'}
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
		extensions: ["scss", ".tsx", ".ts", ".js"],
	},
	
	output: {
		filename: "js/[name].js",
		path: path.resolve(__dirname) + "/dist",
	},

	plugins: [new CleanTerminalPlugin()]
}
