import * as fs from "fs";

const BOOTSTRAP_SOURCE	= "./node_modules/bootstrap/dist/js/bootstrap.min.js";
const BOOTSTRAP_DEST	= "./src/js/bootstrap.min.js";

fs.rmSync(BOOTSTRAP_DEST, {force: true});
fs.rmSync(BOOTSTRAP_DEST + ".map", {force: true});

// Block execution until done, but run in parallel
await Promise.all([
	// bootstrap js
	fs.link(
		BOOTSTRAP_SOURCE,
		BOOTSTRAP_DEST,
		() => {},
	),

	// bootstrap source map
	fs.link(
		BOOTSTRAP_SOURCE	+ ".map",
		BOOTSTRAP_DEST		+ ".map",
		() => {},
	),
]);

export {}
