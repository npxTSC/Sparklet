"use strict";

import {rand}			from "libdx";
import {shakeElement}	from "../../util";

const VISIBLE_ROWS	= 2;
const COLUMNS		= 6;
const GUESS_DELAY	= 500; // milliseconds

// Get elements as TypeScript typecasted values
const frame		= <HTMLDivElement>
	document.getElementById("cellFrame");
const gframe	= <HTMLDivElement>
	document.getElementById("gameFrame");
const inputBox	= <HTMLInputElement>
	document.getElementById("inputBox");
const timerE	= <HTMLHeadingElement>
	document.getElementById("timer");

// Main function, as async to allow await
(async () => {
	const {WORDS_LIST, ANSWERS_LIST} = await retrieveWords();
	document.getElementById("lagWarning").remove();
	
	let gameRunning					= false;
	let lastGuessTime:	number		= 0;
	let pastGuesses:	string[]	= [];
	let currentWord:	string		= pickWord();
	let startTime:		number;

	//const ROWS:			HTMLDivElement[]	= [];
	const COLS:			HTMLDivElement[][]	= [];
	const CTexts:		HTMLDivElement[][]	= [];
	
	// Make each row
	for (let i = 0; i < VISIBLE_ROWS; i++) {
		const row = document.createElement("div");
		row.classList.add("row");
		COLS.push([]);
		CTexts.push([]);
		//ROWS.push(row);
	
		// Make cells in row
		for (let j = 0; j < COLUMNS; j++) {
			const cell = document.createElement("div");
			cell.classList.add("cell", "col-2");
	
			const cellText = document.createElement("div");
			cellText.classList.add("cellText");
			cellText.innerHTML = "X";
			
			cell.appendChild(cellText);
			row.appendChild(cell);

			CTexts[i].push(cellText);
			COLS[i].push(cell);
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
		} // else if (e.key === "Shift") alert(currentWord);
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

		// Prevent spamming guesses
		if (Date.now() - lastGuessTime < GUESS_DELAY) return fail("aliceblue");

		
		
		inputBox.value = "";
	
		// Don't allow guesses with less letters
		if (guess.length !== COLUMNS) return fail("darkred");

		// Don't allow guesses from made-up words
		if (!(WORDS_LIST.includes(guess))) return fail("darkred");

		// Don't allow previous guesses (They won't appear as answers)
		if (pastGuesses.includes(guess)) return fail("darkslategray");

		
		// If you made it here, your guess is possible. Let's try it!
		pastGuesses.unshift(guess);
		lastGuessTime = Date.now();
		if (guess === currentWord) correctGuess();
		else incorrectGuess();
		updateHintRows();
	
		function fail(col: string): void {
			flashBox(col);
		}

		function correctGuess(): void {
			currentWord = pickWord();
			flashBox("#018749");
			shakeElement(gframe, 500, 10);
		}

		function incorrectGuess(): void {
			flashBox("red");
		}
	}

	async function timerTick() {
		const elapsed = Date.now() - startTime;
		const left = 90 - (elapsed / 1000);
		const dispLeft = left < 0 ? 0 : Math.ceil(left);
		
		timerE.innerText = dispLeft + "s";
	}

	function pickWord(): string {
		let w;
		
		do {
			w = rand.r_choice(ANSWERS_LIST);
		} while (pastGuesses.includes(w));

		return w;
	}

	function flashBox(	col: string = "red",
						time: number = 300): void {
		inputBox.style.background = col;
		
		setTimeout(() => {
			inputBox.style.background = "white";
		}, time);
	}

	function updateHintRows(): void {
		// For each row, update its cells
		COLS.forEach((row, i) => {

			// For each cell...
			row.forEach((cell, j) => {
				const ctextE = CTexts[i][j];
				const letter = pastGuesses[i]?.[j];
				
				// Set letter of CText to letter from past guess
				ctextE.innerText = letter ?? "X";

				// Set color
				ctextE.style.background =
					getLetterColor(currentWord, letter, j);
			});
		});
	}
})();

function getLetterColor(word:	string,
						letter:	string,
						slot:	number) {
	return	(!letter)				? "darkslategray"	:
			(word[slot] === letter)	? "green"			:
			(word.includes(letter))	? "gold"			:
			"lightslategray";
}

async function retrieveWords() {
	// Request data from server
	return {
		WORDS_LIST:		await fetch("/words.txt")
							.then(data => data.text())
							.then(str => str.toUpperCase().split(/\s+/)),
		ANSWERS_LIST:	await fetch("/answers.txt")
							.then(data => data.text())
							.then(str => str.toUpperCase().split(/\s+/)),
	}
}