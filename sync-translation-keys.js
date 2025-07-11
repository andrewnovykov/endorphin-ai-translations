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
if (!languages.includes(englishDir)) {
	console.error(`${colors.red}❌ English directory '${englishDir}' not found!${colors.reset}`);
	process.exit(1);
}

// Function to set nested key in object
function setNestedKey(obj, keyPath, value) {
	const keys = keyPath.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current) || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key];
	}

	current[keys[keys.length - 1]] = value;
}

// Function to get nested key from object
function getNestedKey(obj, keyPath) {
	const keys = keyPath.split('.');
	let current = obj;

	for (const key of keys) {
		if (current === null || current === undefined || !(key in current)) {
			return undefined;
		}
		current = current[key];
	}

	return current;
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

console.log(`${colors.bright}${colors.cyan}🔧 TRANSLATION KEY SYNCHRONIZER${colors.reset}\n`);
console.log(`${colors.blue}📂 Found ${languages.length} languages: ${languages.join(', ')}${colors.reset}\n`);

const englishFiles = getJsonFiles(englishDir);
console.log(`${colors.green}📋 Found ${englishFiles.length} English files to process${colors.reset}\n`);

let totalAdded = 0;
let totalFiles = 0;
let totalCreated = 0;

// Process each language
for (const language of languages) {
	if (language === englishDir) continue;

	console.log(`${colors.bright}${colors.magenta}🌍 SYNCHRONIZING ${language.toUpperCase()}${colors.reset}`);
	console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}`);

	let languageAdded = 0;
	let languageFiles = 0;
	let languageCreated = 0;

	for (const englishFile of englishFiles) {
		const relativePath = path.relative(englishDir, englishFile);
		const targetFile = path.join(language, relativePath);

		totalFiles++;
		languageFiles++;

		console.log(`\n${colors.cyan}📄 Processing: ${relativePath}${colors.reset}`);

		const englishContent = JSON.parse(fs.readFileSync(englishFile, 'utf8'));
		const englishKeys = getAllKeys(englishContent);

		let targetContent = {};
		let fileCreated = false;

		if (fs.existsSync(targetFile)) {
			try {
				targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
				console.log(`  ${colors.blue}📖 Loaded existing file${colors.reset}`);
			} catch (error) {
				console.log(`  ${colors.red}❌ Error reading file: ${error.message}${colors.reset}`);
				console.log(`  ${colors.yellow}🔄 Creating new file...${colors.reset}`);
				targetContent = {};
				fileCreated = true;
			}
		} else {
			console.log(`  ${colors.yellow}📝 Creating missing file...${colors.reset}`);

			// Create directory if it doesn't exist
			const targetDir = path.dirname(targetFile);
			if (!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir, { recursive: true });
				console.log(`  ${colors.green}📁 Created directory: ${targetDir}${colors.reset}`);
			}

			fileCreated = true;
			totalCreated++;
			languageCreated++;
		}

		const targetKeys = getAllKeys(targetContent);
		const missingKeys = englishKeys.filter((key) => !targetKeys.includes(key));

		if (missingKeys.length > 0) {
			console.log(`  ${colors.yellow}➕ Adding ${missingKeys.length} missing keys:${colors.reset}`);

			for (const key of missingKeys) {
				const englishValue = getNestedKey(englishContent, key);
				const placeholder = `[${language.toUpperCase()}] ${englishValue}`;

				setNestedKey(targetContent, key, placeholder);
				console.log(`    ${colors.green}+ ${key}: "${placeholder}"${colors.reset}`);

				totalAdded++;
				languageAdded++;
			}
		} else {
			console.log(`  ${colors.green}✅ No missing keys${colors.reset}`);
		}

		// Write the updated file
		fs.writeFileSync(targetFile, JSON.stringify(targetContent, null, 2) + '\n');

		if (fileCreated) {
			console.log(`  ${colors.green}📝 Created: ${targetFile}${colors.reset}`);
		} else if (missingKeys.length > 0) {
			console.log(`  ${colors.green}💾 Updated: ${targetFile}${colors.reset}`);
		}
	}

	// Language summary
	console.log(`\n${colors.magenta}📊 ${language.toUpperCase()} SUMMARY:${colors.reset}`);
	console.log(`  Files processed: ${languageFiles}`);
	console.log(`  Files created: ${colors.green}${languageCreated}${colors.reset}`);
	console.log(`  Keys added: ${colors.green}${languageAdded}${colors.reset}`);
	console.log(`${colors.magenta}${'='.repeat(50)}${colors.reset}\n`);
}

// Final summary
console.log(`${colors.bright}${colors.cyan}🎯 FINAL SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
console.log(`Languages processed: ${languages.length - 1}`);
console.log(`Total files processed: ${totalFiles}`);
console.log(`Total files created: ${colors.green}${totalCreated}${colors.reset}`);
console.log(`Total keys added: ${colors.green}${totalAdded}${colors.reset}`);

if (totalAdded > 0 || totalCreated > 0) {
	console.log(`\n${colors.green}🎉 Synchronization complete!${colors.reset}`);
	console.log(
		`${colors.yellow}💡 NOTE: Added keys are marked with [${languages
			.filter((l) => l !== 'en')
			.map((l) => l.toUpperCase())
			.join('][')}] prefixes.${colors.reset}`
	);
	console.log(`${colors.yellow}🔤 Please replace these placeholders with actual translations.${colors.reset}`);
} else {
	console.log(`\n${colors.green}✅ All translations are already synchronized!${colors.reset}`);
}
