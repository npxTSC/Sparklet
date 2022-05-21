"use strict";

const VISIBLE_ROWS	= 2;
const COLUMNS		= 6;

// Get elements as TypeScript typecasted values
const frame		= <HTMLDivElement>
	document.getElementById("cellFrame");
const inputBox	= <HTMLInputElement>
	document.getElementById("inputBox");
const timerE	= <HTMLHeadingElement>
	document.getElementById("timer");

// Main function, as async to allow await
(async () => {
	const WORDS_LIST = await retrieveWords();
	let gameRunning = false;
	let startTime: number;
	
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

			if (!gameRunning) {
				gameRunning = true;
				startTime = Date.now();
				setInterval(timerTick, 40);
			}
		}
	});

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
		if (guess.length !== COLUMNS) return fail("red");

		// Don't allow guesses from made-up words
		if (!(WORDS_LIST.includes(guess))) return fail("darkred");
	
		function fail(col: string = "red"): void {
			inputBox.style.background = col;
			
			setTimeout(() => {
				inputBox.style.background = "white";
			}, 300);
		}
	}

	async function timerTick() {
		const elapsed = Date.now() - startTime;
		const left = 90 - (elapsed / 1000);
		const dispLeft = left < 0 ? 0 : Math.ceil(left);
		
		timerE.innerText = dispLeft + "s";
	}
})();

async function retrieveWords() {
	// Request data from server
	return	await fetch("/words.txt")
				.then(data => data.text())
				.then(str => str.toUpperCase().split(/\s+/));
}
