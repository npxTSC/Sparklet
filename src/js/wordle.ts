"use strict";

const VISIBLE_ROWS = 2;

const frame = <HTMLDivElement> document.getElementById("cellFrame");

// Make each row
for (let i = 0; i < VISIBLE_ROWS; i++) {
	const row = document.createElement("div");
	row.classList.add("row");

	// Make cells in row
	for (let j = 0; j < 6; j++) {
		const cell = document.createElement("div");
		cell.classList.add("cell", "col-2");

		//const ctc = document.createElement("div");
		//ctc.classList.add("cellTextContainer");
		
		const cellText = document.createElement("div");
		cellText.classList.add("cellText");
		cellText.innerHTML = "X";

		//ctc.appendChild(cellText);
		//cell.appendChild(ctc);
		cell.appendChild(cellText);
		row.appendChild(cell);
	}
	
	frame.appendChild(row);
}