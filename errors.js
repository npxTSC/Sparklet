class TestError extends Error {
	constructor(message) {
		super(message);
		this.name = TestError;
	}
}

module.exports = [
	TestError,
];
