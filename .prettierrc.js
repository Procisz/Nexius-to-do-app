module.exports = {
	singleQuote: true,
	endOfLine: 'auto',
	useTabs: true,
	printWidth: 130,
	htmlWhitespaceSensitivity: 'ignore',
	trailingComma: 'all',
	overrides: [
		{
			files: ['*.json'],
			options: {
				useTabs: false,
			},
		},
		{
			files: ['*.html'],
			options: {
				parser: "angular"
			}
		}
	],
};
