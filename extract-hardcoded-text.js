#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Documentation pages that need text extraction
const DOC_PAGES = [
	'src/pages/TestRecorder.tsx',
	'src/pages/HTMLReporter.tsx',
	'src/pages/EnvironmentSetup.tsx',
	'src/pages/GlobalSetup.tsx',
	'src/pages/CICDSetup.tsx',
	'src/pages/VSCodeDebugging.tsx',
	'src/pages/PromptGuide.tsx',
	'src/pages/QuickStart.tsx',
];

console.log('🔍 Scanning doc pages for hardcoded text...');

const extractHardcodedText = (filePath) => {
	try {
		const fullPath = path.join(__dirname, '..', filePath);
		if (!fs.existsSync(fullPath)) {
			console.log(`⚠️  File not found: ${filePath}`);
			return { hardcodedStrings: [], hasTranslations: false };
		}

		const content = fs.readFileSync(fullPath, 'utf8');

		// Check if file uses translations
		const hasTranslations = content.includes('useTranslation') && content.includes('t(');

		// Extract hardcoded strings (text in quotes that's not a prop or attribute)
		const hardcodedStrings = [];

		// Look for JSX text content
		const jsxTextPattern = />([^<>\n]+)</g;
		let match;
		while ((match = jsxTextPattern.exec(content)) !== null) {
			const text = match[1].trim();
			if (text && !text.match(/^\s*$/) && !text.startsWith('{') && !text.startsWith('t(')) {
				hardcodedStrings.push(text);
			}
		}

		// Look for string literals in JSX
		const stringLiteralPattern = /[">]\s*["']([^"'>\n]+)["']/g;
		while ((match = stringLiteralPattern.exec(content)) !== null) {
			const text = match[1].trim();
			if (
				text &&
				text.length > 3 &&
				!text.startsWith('w-') &&
				!text.startsWith('h-') &&
				!text.startsWith('text-')
			) {
				hardcodedStrings.push(text);
			}
		}

		// Remove duplicates and filter out obvious CSS classes, etc.
		const uniqueStrings = [...new Set(hardcodedStrings)].filter((str) => {
			return !str.match(
				/^(w-|h-|text-|bg-|border-|rounded|flex|items|justify|gap|space|mb-|mt-|mr-|ml-|p-|px-|py-|m-|mx-|my-)/
			);
		});

		return { hardcodedStrings: uniqueStrings, hasTranslations };
	} catch (error) {
		console.log(`❌ Error reading ${filePath}: ${error.message}`);
		return { hardcodedStrings: [], hasTranslations: false };
	}
};

const results = {};

DOC_PAGES.forEach((filePath) => {
	const result = extractHardcodedText(filePath);
	results[filePath] = result;

	console.log(`\n📄 ${filePath}:`);
	console.log(`  Uses translations: ${result.hasTranslations ? '✅' : '❌'}`);
	console.log(`  Hardcoded strings found: ${result.hardcodedStrings.length}`);

	if (result.hardcodedStrings.length > 0) {
		console.log(`  Examples:`);
		result.hardcodedStrings.slice(0, 5).forEach((str) => {
			console.log(`    - "${str}"`);
		});
		if (result.hardcodedStrings.length > 5) {
			console.log(`    ... and ${result.hardcodedStrings.length - 5} more`);
		}
	}
});

// Summary
console.log('\n📊 Summary:');
const totalPages = DOC_PAGES.length;
const pagesWithTranslations = Object.values(results).filter((r) => r.hasTranslations).length;
const pagesWithHardcodedText = Object.values(results).filter((r) => r.hardcodedStrings.length > 0).length;

console.log(`Total pages scanned: ${totalPages}`);
console.log(`Pages using translations: ${pagesWithTranslations}`);
console.log(`Pages with hardcoded text: ${pagesWithHardcodedText}`);

console.log('\n🚨 Pages that need text extraction:');
Object.entries(results).forEach(([filePath, result]) => {
	if (!result.hasTranslations || result.hardcodedStrings.length > 0) {
		console.log(`  ❌ ${filePath} - ${result.hardcodedStrings.length} hardcoded strings`);
	}
});

// Save detailed results
fs.writeFileSync(path.join(__dirname, 'text-extraction-audit.json'), JSON.stringify(results, null, 2));

console.log('\n💾 Detailed results saved to text-extraction-audit.json');
console.log(
	'\n⚠️  IMPORTANT: Before creating translation files, all hardcoded text must be extracted to translation keys!'
);
