"use strict";

const VISIBLE_ROWS	= 2;
const COLUMNS		= 6;

// Get elements as TypeScript typecasted values
const frame		= <HTMLDivElement>
	document.getElementById("cellFrame");
const inputBox	= <HTMLInputElement>
	document.getElementById("inputBox");

// Main function, as async to allow await
(async () => {
	const words = await retrieveWords();
	
	// Make each row
	for (let i = 0; i < VISIBLE_ROWS; i++) {
		const row = document.createElement("div");
		row.classList.add("row");
	
		// Make cells in row
		for (let j = 0; j < COLUMNS; j++) {
			const cell = document.createElement("div");
			cell.classList.add("cell", "col-2");
	
			const cellText = document.createElement("div");
			cellText.classList.add("cellText");
			cellText.innerHTML = "X";
			
			cell.appendChild(cellText);
			row.appendChild(cell);
		}
		
		frame.appendChild(row);
	}
	
	// Filter input box
	inputBox.addEventListener("input", (e) => {
		inputBox.value = filterInput(inputBox.value);
	});
	
	inputBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			attemptSubmit();
		}
	});
})();

function filterInput(premod: string): string {
	const caps = premod.toUpperCase();
	let truncated = caps;
	if (truncated.length > COLUMNS)
		truncated = truncated.substring(0, COLUMNS);

	return truncated;
}

function attemptSubmit() {
	const guess = inputBox.value;

	// Don't allow guesses with less letters
	if (guess.length !== COLUMNS) return fail();

	function fail(col: string = "red"): void {
		inputBox.style.background = col;
		
		setTimeout(() => {
			inputBox.style.background = "white";
		}, 300);
	}
}

async function retrieveWords() {
	// Request data from server
	let res =
		await fetch("/words.txt")
				.then(data => data.text())
				.then(str => str.split(/\s+/));

	console.log(res);
	
	// Parse into array
	return res;
}
