/********\
* Amogus *
\********/

"use strict";

import {rand, elem, str}	from "libdx";

const ROWS			= 9;
const COLUMNS		= 9;

// TypeScript keeps thinking setInterval is from Node ._.
const {setInterval} = window;
let interval: number;

// Get elements as TypeScript casted values
const frame		= <HTMLDivElement>
	document.getElementById("cellFrame");
const gframe	= <HTMLDivElement>
	document.getElementById("gameFrame");

// Main function, as async to allow await
(async () => {
	const board:			RowData[]	= [];
	
	// Make each row
	for (let i = 0; i < ROWS; i++) {
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

	/*
	
	// Filter input box
	inputBox.addEventListener("input", (e) => {
		inputBox.value = filterInput(inputBox.value);
	});
	
	inputBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			attemptSubmit();
		}
	});

	*/

	function filterInput(premod: string): string {
		const caps = premod.toUpperCase();
		let truncated = caps;
		if (truncated.length > COLUMNS)
			truncated = truncated.substring(0, COLUMNS);
	
		return truncated;
	}

	function updateHintRows(): void {
		// For each row, update its cells
		//board.forEach(recolorRow);
	}
})();

interface RowData {
	rowE:		HTMLDivElement;
	cellsE:		HTMLDivElement[];
	ctextsE:	HTMLDivElement[];
}