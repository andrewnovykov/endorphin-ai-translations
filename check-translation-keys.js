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
	white: '\x1b[37m',
};

// Get all language directories
const languages = fs
	.readdirSync('.')
	.filter(
		(item) =>
			fs.statSync(item).isDirectory() && !item.startsWith('.') && item !== 'built' && item !== 'node_modules'
	);

const englishDir = 'en';
if (!languages.includes(englishDir)) {
	console.error(`${colors.red}❌ English directory '${englishDir}' not found!${colors.reset}`);
	process.exit(1);
}

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

// Function to check missing keys for a single file
function checkFileKeys(englishFile, targetFile, language) {
	const englishContent = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
	const targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

	const englishKeys = getAllKeys(englishContent);
	const targetKeys = getAllKeys(targetContent);

	const missingKeys = englishKeys.filter((key) => !targetKeys.includes(key));
	const extraKeys = targetKeys.filter((key) => !englishKeys.includes(key));

	return { missingKeys, extraKeys, englishKeys, targetKeys };
}

console.log(`${colors.bright}${colors.cyan}🔍 TRANSLATION KEY SYNCHRONIZATION CHECKER${colors.reset}\n`);
console.log(`${colors.blue}📂 Found ${languages.length} languages: ${languages.join(', ')}${colors.reset}\n`);

// Get all English JSON files
const englishFiles = getJsonFiles(englishDir);
console.log(`${colors.green}📋 Found ${englishFiles.length} English files to check${colors.reset}\n`);

let totalIssues = 0;
let totalFiles = 0;
let perfectFiles = 0;

// Process each language
for (const language of languages) {
	if (language === englishDir) continue;

	console.log(`${colors.bright}${colors.magenta}🌍 CHECKING ${language.toUpperCase()}${colors.reset}`);
	console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}`);

	let languageIssues = 0;
	let languageFiles = 0;
	let languagePerfectFiles = 0;

	for (const englishFile of englishFiles) {
		const relativePath = path.relative(englishDir, englishFile);
		const targetFile = path.join(language, relativePath);

		totalFiles++;
		languageFiles++;

		console.log(`\n${colors.cyan}📄 Checking: ${relativePath}${colors.reset}`);

		if (!fs.existsSync(targetFile)) {
			console.log(`  ${colors.red}❌ FILE MISSING: ${targetFile}${colors.reset}`);
			languageIssues++;
			totalIssues++;
			continue;
		}

		try {
			const { missingKeys, extraKeys, englishKeys, targetKeys } = checkFileKeys(
				englishFile,
				targetFile,
				language
			);

			console.log(`  ${colors.blue}📊 English keys: ${englishKeys.length}${colors.reset}`);
			console.log(`  ${colors.blue}📊 ${language} keys: ${targetKeys.length}${colors.reset}`);

			if (missingKeys.length === 0 && extraKeys.length === 0) {
				console.log(`  ${colors.green}✅ PERFECT MATCH - All keys synchronized!${colors.reset}`);
				perfectFiles++;
				languagePerfectFiles++;
			} else {
				if (missingKeys.length > 0) {
					console.log(`  ${colors.red}❌ MISSING KEYS (${missingKeys.length}):${colors.reset}`);
					missingKeys.forEach((key) => {
						console.log(`    ${colors.red}  - ${key}${colors.reset}`);
					});
					languageIssues += missingKeys.length;
					totalIssues += missingKeys.length;
				}

				if (extraKeys.length > 0) {
					console.log(`  ${colors.yellow}⚠️  EXTRA KEYS (${extraKeys.length}):${colors.reset}`);
					extraKeys.forEach((key) => {
						console.log(`    ${colors.yellow}  + ${key}${colors.reset}`);
					});
					languageIssues += extraKeys.length;
					totalIssues += extraKeys.length;
				}
			}
		} catch (error) {
			console.log(`  ${colors.red}❌ ERROR: ${error.message}${colors.reset}`);
			languageIssues++;
			totalIssues++;
		}
	}

	// Language summary
	console.log(`\n${colors.magenta}📊 ${language.toUpperCase()} SUMMARY:${colors.reset}`);
	console.log(`  Files checked: ${languageFiles}`);
	console.log(`  Perfect files: ${colors.green}${languagePerfectFiles}${colors.reset}`);
	console.log(`  Files with issues: ${colors.red}${languageFiles - languagePerfectFiles}${colors.reset}`);
	console.log(`  Total issues: ${colors.red}${languageIssues}${colors.reset}`);
	console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}\n`);
}

// Final summary
console.log(`${colors.bright}${colors.cyan}🎯 FINAL SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`Languages checked: ${languages.length - 1}`);
console.log(`Total files checked: ${totalFiles}`);
console.log(`Perfect files: ${colors.green}${perfectFiles}${colors.reset}`);
console.log(`Files with issues: ${colors.red}${totalFiles - perfectFiles}${colors.reset}`);
console.log(`Total issues found: ${colors.red}${totalIssues}${colors.reset}`);

if (totalIssues === 0) {
	console.log(`\n${colors.green}🎉 CONGRATULATIONS! All translations are perfectly synchronized!${colors.reset}`);
	process.exit(0);
} else {
	console.log(`\n${colors.red}❌ Found ${totalIssues} synchronization issues that need attention.${colors.reset}`);
	console.log(`${colors.yellow}💡 TIP: Run 'npm run sync-keys' to automatically fix missing keys.${colors.reset}`);
	process.exit(1);
}
