"use strict";

import {rand, elem, str}	from "libdx";

const VISIBLE_ROWS	= 2;
const COLUMNS		= 6;
const GUESS_DELAY	= 500; // milliseconds
const TIME_LIMIT	= 360; // seconds

// TypeScript keeps thinking setInterval is from Node ._.
const {setInterval} = window;
let interval: number;

// Get elements as TypeScript casted values
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
	document.getElementById("lagWarning")!.remove();
	
	let gameRunning						= false;
	let lastGuessTime:		number		= 0;
	let lastCorrectTime:	number		= Date.now();
	let pastGuesses:		string[]	= [];
	let currentWord:		string		= pickWord();
	let winstats:			{word: string, time: number}[] = [];
	let startTime:			number;
	
	const board:			RowData[]	= [];
	
	// Make each row
	for (let i = 0; i < VISIBLE_ROWS; i++) {
		const row = document.createElement("div");
		row.classList.add("row");
		
		board.push({
			rowE:			row,
			cellsE:			[],
			ctextsE:		[],
		});
	
		// Make cells in row
		for (let j = 0; j < COLUMNS; j++) {
			const cell = document.createElement("div");
			cell.classList.add("cell", "col-2");
	
			const cellText = document.createElement("div");
			cellText.classList.add("cellText");
			cellText.innerHTML = "X";
			
			cell.appendChild(cellText);
			row.appendChild(cell);

			board[i].ctextsE.push(cellText);
			board[i].cellsE.push(cell);
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
		if (!gameRunning) {
			gameRunning = true;
			startTime = lastCorrectTime = Date.now();
			interval = setInterval(timerTick, 40);
		}
		
		pastGuesses.unshift(guess);
		lastGuessTime = Date.now();
		if (guess === currentWord) correctGuess();
		else incorrectGuess();
		updateHintRows();
	
		function fail(col: string): void {
			flashBox(col);
		}

		function correctGuess(): void {
			winstats.push({
				word: currentWord,
				time: Date.now() - lastCorrectTime,
			});

			currentWord = pickWord();
			lastCorrectTime = Date.now();
			flashBox("#018749");
			elem.shakeElement(gframe, 700, 20);
		}

		function incorrectGuess(): void {
			flashBox("red");
		}
	}

	async function timerTick() {
		const elapsed = Date.now() - startTime;
		const left = TIME_LIMIT - (elapsed / 1000);
		const dispLeft = left < 0 ? 0 : Math.ceil(left);
		
		timerE.innerText = dispLeft + "s";

		if (left < 0) {
			const easiestWord = winstats.sort((a, b) => (a.time > b.time ? 1 : -1))?.[0];
			
			alert(
`GAME OVER! GG+WP
You were trying to solve "${currentWord}"
HITS: ${Object.keys(winstats).length}
MISSES: ${pastGuesses.length - Object.keys(winstats).length}
ATTEMPTS: ${pastGuesses.length}

YOUR EASIEST WORD: ${easiestWord?.word ?? "None"}
(Took you ${Math.ceil((easiestWord?.time ?? 0)/1000)} seconds to solve!)`);

			clearInterval(interval);

			// Refresh
			window.location.reload();
		}
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
		board.forEach(recolorRow);
	}
	
	function recolorRow(rData: RowData, rNum: number) {
		const rowContent = pastGuesses[rNum];
		
		// For each letter...
		for (let slot = 0; slot < rData.cellsE.length; slot++) {
			const c = rData.cellsE[slot];
			const ct = rData.ctextsE[slot];

			const letter = rowContent?.[slot];
			
			ct.innerText = letter ?? "X";
	
			ct.style.background = getLetterColor(rowContent, slot);
		}
	}

	function getLetterColor(guess:	string,
							slot:	number) {
		const letter = guess[slot];

		if (!letter)						return "darkslategray";
		if ((currentWord[slot] === letter))	return "green";

		// Yellow-box algorithm
		if (currentWord.includes(letter)) {
			return "gold";
			
			/*const occsInWord = str.occurrenceArray(currentWord, letter);
			const occsInGuess = str.occurrenceArray(guess, letter);
			
			// If the letter in this cell occurs more
			// than once in the correct word
			if (occsInWord.length > 1) {
				// If there aren't already that many greens
				// or yellows, then make it yellow.
				if (occsInGuess.length > occsInWord.length) {
					//
				}
				
				// Otherwise, default to gray.
			} else {
				// If only 1 of the letter is in the word,
				// and this letter is in the wrong place,
				// then the only option is yellow.
				return "gold";
			}*/
		}

		// Default value
		return "lightslategray";
	}
})();

async function retrieveWords() {
	// Request data from server
	return {
		WORDS_LIST:		await fetch("/public/sparks/wordle/words.txt")
							.then(data => data.text())
							.then(str => str.toUpperCase().split(/\s+/)),
		ANSWERS_LIST:	await fetch("/public/sparks/wordle/answers.txt")
							.then(data => data.text())
							.then(str => str.toUpperCase().split(/\s+/)),
	}
}

interface RowData {
	rowE:		HTMLDivElement;
	cellsE:		HTMLDivElement[];
	ctextsE:	HTMLDivElement[];
}