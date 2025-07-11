#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Starting comprehensive translation audit...');

// Get all pages to audit
const PAGES_TO_AUDIT = [
	'src/pages/index.tsx',
	'src/pages/Documentation.tsx',
	'src/pages/NotFound.tsx',
	'src/pages/QuickStart.tsx',
	'src/pages/ProjectSetup.tsx',
	'src/pages/EnvironmentSetup.tsx',
	'src/pages/GlobalSetup.tsx',
	'src/pages/TestStructure.tsx',
	'src/pages/TestWritingTips.tsx',
	'src/pages/TestRecorder.tsx',
	'src/pages/PromptGuide.tsx',
	'src/pages/VSCodeDebugging.tsx',
	'src/pages/CICDSetup.tsx',
	'src/pages/HTMLReporter.tsx',
	'src/components/Header.tsx',
	'src/components/Footer.tsx',
	'src/components/HeroSection.tsx',
	'src/components/FeaturesSection.tsx',
	'src/components/WhyChooseUsSection.tsx',
	'src/components/CodeExampleSection.tsx',
	'src/components/LanguageSwitcher.tsx',
];

// Extract translation keys from a file
const extractTranslationKeys = (filePath) => {
	try {
		const fullPath = path.join(__dirname, '..', filePath);
		const content = fs.readFileSync(fullPath, 'utf8');

		// Extract all t('key') patterns
		const tPattern = /t\(['"](.*?)['"]\)/g;
		const keys = [];
		let match;

		while ((match = tPattern.exec(content)) !== null) {
			keys.push(match[1]);
		}

		return keys;
	} catch (error) {
		console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
		return [];
	}
};

// Extract all translation keys
const allKeys = new Set();
const keysByFile = {};

console.log('\n📝 Extracting translation keys from all pages...');
PAGES_TO_AUDIT.forEach((filePath) => {
	const keys = extractTranslationKeys(filePath);

	if (keys.length > 0) {
		keysByFile[filePath] = keys;
		keys.forEach((key) => allKeys.add(key));
		console.log(`  ${filePath}: ${keys.length} keys found`);
	}
});

console.log(`\n📊 Total unique translation keys found: ${allKeys.size}`);

// Save the extracted keys for next steps
const results = {
	totalKeys: allKeys.size,
	allKeys: Array.from(allKeys).sort(),
	keysByFile,
};

fs.writeFileSync(path.join(__dirname, 'extracted-keys.json'), JSON.stringify(results, null, 2));

console.log('\n💾 Results saved to extracted-keys.json');
console.log('\n🔤 First 20 translation keys found:');
Array.from(allKeys)
	.sort()
	.slice(0, 20)
	.forEach((key) => {
		console.log(`  ${key}`);
	});

console.log('\n✅ Audit complete! Next step: Create sync script.');
