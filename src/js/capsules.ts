// Capsule search page
"use strict";

import {SparkletDB, CapsuleContent}	from "../../classes";
import {cmon, sleep$}				from "libdx";

// Elements
const searchbox		= document.getElementById("capsuleSearch")	as HTMLInputElement;
const resultsbox	= document.getElementById("results")		as HTMLDivElement;
const listingsDiv	= document.getElementById("listings")		as HTMLDivElement;
const noResultsE	= document.getElementById("noresults")		as HTMLDivElement;


// wait this long (ms) for the user to stop typing
// before updating the capsules listing
const SEARCHBOX_CHECK_DELAY = 400;


const listingBlueprint = resultsbox.lastElementChild as HTMLDivElement;
function makeListingE(	capsule: SparkletDB.Capsule,
						content: CapsuleContent	): HTMLDivElement {
	
	const el = <HTMLDivElement>listingBlueprint.cloneNode(true);
	el.style.display = "flex";
	
	const {name, creator, uuid} = capsule;

	// Title
	(<HTMLParagraphElement> el.children[0].children[0])
		.innerText = name;
	
	(<HTMLParagraphElement> el.children[0].children[1])
		.innerText = "Made by " + creator;
	
	(<HTMLAnchorElement> el.children[1].children[0])
		.addEventListener("click", () => createQPRoom(uuid));
	
	return el;
}

async function createQPRoom(cuuid: string) {
	if (!currentAccount) return alert("Make an account first!");
	
	const data = {
		cuuid,
	}
	
	const res = await fetch("/create-room/quiz/", {
		method:	"POST",
		body:	JSON.stringify(data),
		headers: {
			"Accept":		"application/json",
			"Content-Type":	"application/json",
		},
	});

	if (!res.ok) {
		console.error(await res.json());
		return alert("There was a problem contacting the server.");
	}

	const room = await res.json();

	document.cookie = cmon.assignment("qhostAuthToken", room.authToken);

	location.href = "/host-room/" + room.joinHash;
}

function fetchCapsules(query?: string) {
	const fetchSuffix = (query ? `?q=${encodeURIComponent(query)}` : "");
	
	fetch("/api/capsules" + fetchSuffix)
		.then((res) => res.json())
		.then(updateListings);
}

function updateListings(rows: SparkletDB.Capsule[]) {
	// Clear previous results
	listingsDiv.innerHTML = "";

	if (rows.length > 0) {
		// Hide "no results" widget
		noResultsE.style.display = "none";
		
		// Show results
		rows.forEach((row) => {
			const content = <CapsuleContent>JSON.parse(row.content);
			listingsDiv.appendChild(makeListingE(row, content));
		});
	} else {
		// Show "no results" widget
		noResultsE.style.display = "block";
	}
}




searchbox.addEventListener("input", () => {
	const oldValue = searchbox.value;
	sleep$(SEARCHBOX_CHECK_DELAY);
	
	// if changed after delay
	if (searchbox.value !== oldValue) {
		fetchCapsules(searchbox.value);
	}
});




// the actual code lol
fetchCapsules();
