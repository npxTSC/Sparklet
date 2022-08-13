// Capsule search page
"use strict";

import {Capsule, CapsuleContent}	from "../../classes";
import {cmon}						from "libdx";

// Elements
const searchbox		= document.getElementById("capsuleSearch")	as HTMLInputElement;
const resultsbox	= document.getElementById("results")		as HTMLDivElement;
const listingsDiv	= document.getElementById("listings")		as HTMLDivElement;
const noResultsE	= document.getElementById("noresults")		as HTMLDivElement;



const listingBlueprint = resultsbox.lastElementChild as HTMLDivElement;
function makeListingE(	capsule: Capsule,
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
		console.log(await res.json());
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

function updateListings(rows: Capsule[]) {
	// Clear previous results
	listingsDiv.innerHTML = "";

	if (rows.length > 0) {
		// Hide "no results" widget
		noResultsE.style.display = "none";
		
		// Show results
		rows.forEach((row) => {
			const content = <CapsuleContent>JSON.parse(row.content);
	
			console.log(content);
			listingsDiv.appendChild(makeListingE(row, content));
		});
	} else {
		// Show "no results" widget
		noResultsE.style.display = "block";
	}
}




searchbox.addEventListener("input", () => {
	fetchCapsules(searchbox.value);
});




// the actual code lol
fetchCapsules();
