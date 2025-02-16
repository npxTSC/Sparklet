export namespace math {
	export function factorial(n = 1) {
		if (n < 1) throw new TypeError("Invalid Factorial!");
		let final = n;
		
		while (n > 1) {
			final *= n;
		}

		return final;
	}
}

export namespace qstr {
	export function clearQ() {
		const qsurl = window.location.toString();
		if (qsurl.indexOf("?") > 0) {
			const clean_qsurl = qsurl.substring(0, qsurl.indexOf("?"));
			window.history.replaceState({}, document.title, clean_qsurl);
		}
	}
	
	export function parseQ() {
		return parseSpecificQ(document.location.search);
	}
	
	function parseSpecificQ(queryString: string) {
		const dict: Record<string, string> = {};
		
		if (queryString.indexOf("?") === 0) {
			queryString = queryString.substr(1);
		}
		
		const parts = queryString.split("&");
		parts.forEach((part: string) => {
			const [key, value] = part.split("=");
			dict[key] = decodeURIComponent(value).replace(/\+/g, " ");
		});
		return dict;
	}
}

export namespace rand {
	export function r_int(min: number, max: number) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	
	export function r_num(min: number, max: number) {
		return (Math.random() * (max - min)) + min;
	}

	export function r_choice(arr: any[]) {
		return arr[r_int(0, arr.length - 1)];
	}
}