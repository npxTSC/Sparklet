import {Capsule, CapsuleContent}	from "../../classes";

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
		.href = "/createQProom?capsuleUUID="+encodeURIComponent(capsule.uuid);
	
	return el;
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

