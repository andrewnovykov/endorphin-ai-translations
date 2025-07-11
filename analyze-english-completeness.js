#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
};

const languages = fs
	.readdirSync('.')
	.filter(
		(item) =>
			fs.statSync(item).isDirectory() && !item.startsWith('.') && item !== 'built' && item !== 'node_modules'
	);

const englishDir = 'en';

// Function to get all keys from a JSON object recursively
function getAllKeys(obj, prefix = '') {
	const keys = [];
	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			keys.push(...getAllKeys(value, fullKey));
		} else {
			keys.push(fullKey);
		}
	}
	return keys;
}

// Function to get all JSON files in a directory recursively
function getJsonFiles(dir) {
	const files = [];
	const items = fs.readdirSync(dir);

	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			files.push(...getJsonFiles(fullPath));
		} else if (item.endsWith('.json')) {
			files.push(fullPath);
		}
	}

	return files;
}

console.log(`${colors.bright}${colors.cyan}🔍 ENGLISH FILE COMPLETENESS ANALYZER${colors.reset}\n`);
console.log(`${colors.blue}This script identifies keys that might be missing from English files${colors.reset}\n`);

const englishFiles = getJsonFiles(englishDir);
let totalMissingFromEnglish = 0;

// For each English file, find what keys other languages have that English doesn't
for (const englishFile of englishFiles) {
	const relativePath = path.relative(englishDir, englishFile);

	console.log(`${colors.cyan}📄 Analyzing: ${relativePath}${colors.reset}`);

	const englishContent = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
	const englishKeys = getAllKeys(englishContent);

	console.log(`  ${colors.blue}English keys: ${englishKeys.length}${colors.reset}`);

	// Collect all keys from other languages for this file
	const allKeysFromOtherLanguages = new Set();
	const languagesWithExtraKeys = {};

	for (const language of languages) {
		if (language === englishDir) continue;

		const targetFile = path.join(language, relativePath);
		if (fs.existsSync(targetFile)) {
			try {
				const targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
				const targetKeys = getAllKeys(targetContent);

				const extraKeys = targetKeys.filter((key) => !englishKeys.includes(key));
				if (extraKeys.length > 0) {
					languagesWithExtraKeys[language] = extraKeys;
					extraKeys.forEach((key) => allKeysFromOtherLanguages.add(key));
				}
			} catch (error) {
				// Skip files with JSON errors
			}
		}
	}

	if (allKeysFromOtherLanguages.size > 0) {
		console.log(
			`  ${colors.red}❌ Potentially missing from English: ${allKeysFromOtherLanguages.size} keys${colors.reset}`
		);

		// Group by frequency - keys that appear in multiple languages are more likely to be needed
		const keyFrequency = {};
		for (const [lang, keys] of Object.entries(languagesWithExtraKeys)) {
			for (const key of keys) {
				keyFrequency[key] = (keyFrequency[key] || 0) + 1;
			}
		}

		// Sort by frequency (most common first)
		const sortedKeys = Array.from(allKeysFromOtherLanguages).sort(
			(a, b) => (keyFrequency[b] || 0) - (keyFrequency[a] || 0)
		);

		console.log(`  ${colors.yellow}📊 Keys missing from English (by frequency):${colors.reset}`);
		for (const key of sortedKeys) {
			const frequency = keyFrequency[key];
			const languageList = Object.keys(languagesWithExtraKeys)
				.filter((lang) => languagesWithExtraKeys[lang].includes(key))
				.join(', ');

			console.log(
				`    ${colors.yellow}${key}${colors.reset} ${colors.blue}(${frequency} languages: ${languageList})${colors.reset}`
			);
		}

		totalMissingFromEnglish += allKeysFromOtherLanguages.size;
	} else {
		console.log(`  ${colors.green}✅ English has all keys that other languages have${colors.reset}`);
	}

	console.log('');
}

console.log(`${colors.bright}${colors.cyan}🎯 SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`Total files analyzed: ${englishFiles.length}`);
console.log(`Total keys potentially missing from English: ${colors.red}${totalMissingFromEnglish}${colors.reset}`);

if (totalMissingFromEnglish > 0) {
	console.log(`\n${colors.yellow}💡 RECOMMENDATIONS:${colors.reset}`);
	console.log(`1. Review the keys listed above`);
	console.log(`2. Add legitimate keys to English files`);
	console.log(`3. Remove unnecessary keys from translation files`);
	console.log(`4. Run 'npm run sync-keys' to synchronize everything`);
	console.log(`5. Run 'npm run sync-check' to verify synchronization`);
} else {
	console.log(`\n${colors.green}🎉 English files appear to be complete!${colors.reset}`);
}
