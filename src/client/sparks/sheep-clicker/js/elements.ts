namespace elements {
	export const [
		woolBags,
		wbps,
		wbpc,
		clickSound,
		music,
		clickspace,
		clickarea,
		hrDepartment,
		rdDepartment,
		sheep,
		sheepShakeContainer,
	] = [
		document.getElementById("pts"),
		document.getElementById("wbps"),
		document.getElementById("wbpc"),
		(document.getElementById("cs") as HTMLAudioElement),
		(document.getElementById("mus") as HTMLAudioElement),
		document.getElementById("clickspace"),
		(document.getElementById("clickarea") as HTMLDivElement),
		document.getElementById("hr-department"),
		document.getElementById("rd-department"),
		document.getElementById("sheep"),
		document.getElementById("sheep-shake-container"),
	];
}

export default elements;