// Elements
const searchbox = document.getElementById("capsuleSearch") as HTMLInputElement;

searchbox.addEventListener("input", () => {
	fetch(`/api/capsules?q=${encodeURIComponent(searchbox.value)}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(JSON.parse(data[0].content));
		}).catch(err => console.error(err));
});
