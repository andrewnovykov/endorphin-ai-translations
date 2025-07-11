#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// First, let's audit what pages we have and what translation keys they need
const PAGES_TO_AUDIT = [
	// Main pages
	'src/pages/index.tsx',
	'src/pages/Documentation.tsx',
	'src/pages/NotFound.tsx',

	// Documentation pages
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

	// Components
	'src/components/Header.tsx',
	'src/components/Footer.tsx',
	'src/components/HeroSection.tsx',
	'src/components/FeaturesSection.tsx',
	'src/components/WhyChooseUsSection.tsx',
	'src/components/CodeExampleSection.tsx',
	'src/components/LanguageSwitcher.tsx',
];

console.log('🔍 Auditing all pages for translation keys...');

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

const allKeys = new Set();
const keysByFile = {};

// Extract keys from all pages
PAGES_TO_AUDIT.forEach((filePath) => {
	const keys = extractTranslationKeys(filePath);

	if (keys.length > 0) {
		keysByFile[filePath] = keys;
		keys.forEach((key) => allKeys.add(key));
		console.log(`📝 ${filePath}: ${keys.length} keys found`);
	} else {
		console.log(`⚪ ${filePath}: No translation keys found`);
	}
});

console.log(`\n📊 Total unique translation keys found: ${allKeys.size}`);
console.log('\n🔤 All translation keys:');
Array.from(allKeys)
	.sort()
	.forEach((key) => {
		console.log(`  ${key}`);
	});

// Now let's check what's missing in our English translation files
console.log('\n🔍 Checking English translation files...');

const loadAllEnglishTranslations = () => {
	const englishTranslations = {};

	// Load common translations
	const commonDir = path.join(__dirname, 'en/common');
	if (fs.existsSync(commonDir)) {
		const commonFiles = fs.readdirSync(commonDir).filter((f) => f.endsWith('.json'));
		commonFiles.forEach((file) => {
			const filePath = path.join(commonDir, file);
			try {
				const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const namespace = file.replace('.json', '');
				englishTranslations[`common.${namespace}`] = content;
			} catch (error) {
				console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
			}
		});
	}

	// Load pages translations
	const pagesDir = path.join(__dirname, 'en/pages');
	if (fs.existsSync(pagesDir)) {
		const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.json'));
		pageFiles.forEach((file) => {
			const filePath = path.join(pagesDir, file);
			try {
				const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const namespace = file.replace('.json', '');
				englishTranslations[`pages.${namespace}`] = content;
			} catch (error) {
				console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
			}
		});
	}

	// Load docs translations
	const docsDir = path.join(__dirname, 'en/docs');
	if (fs.existsSync(docsDir)) {
		const docFiles = fs.readdirSync(docsDir).filter((f) => f.endsWith('.json'));
		docFiles.forEach((file) => {
			const filePath = path.join(docsDir, file);
			try {
				const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				const namespace = file.replace('.json', '');
				englishTranslations[`docs.${namespace}`] = content;
			} catch (error) {
				console.log(`⚠️  Could not read ${filePath}: ${error.message}`);
			}
		});
	}

	return englishTranslations;
};

const englishTranslations = loadAllEnglishTranslations();

console.log('📄 English translation files loaded:');
Object.keys(englishTranslations).forEach((namespace) => {
	console.log(`  ${namespace}`);
});

// Function to check if a key exists in nested object
const hasNestedKey = (obj, keyPath) => {
	const keys = keyPath.split('.');
	let current = obj;

	for (const key of keys) {
		if (current && typeof current === 'object' && key in current) {
			current = current[key];
		} else {
			return false;
		}
	}

	return true;
};

// Check which keys are missing
const missingKeys = [];
Array.from(allKeys).forEach((key) => {
	let found = false;

	// Check in all namespaces
	for (const [namespace, translations] of Object.entries(englishTranslations)) {
		if (hasNestedKey(translations, key)) {
			found = true;
			break;
		}
	}

	if (!found) {
		missingKeys.push(key);
	}
});

console.log(`\n❌ Missing keys in English translations: ${missingKeys.length}`);
missingKeys.forEach((key) => {
	console.log(`  ${key}`);
});

// Function to create nested object structure from dot notation key
const createNestedObject = (obj, keyPath, value) => {
	const keys = keyPath.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current)) {
			current[key] = {};
		}
		current = current[key];
	}

	current[keys[keys.length - 1]] = value;
	return obj;
};

// Function to determine which file a key should go to
const getFileForKey = (key) => {
	// Map keys to appropriate files based on patterns
	if (key.includes('header') || key.includes('nav') || key.includes('footer')) {
		return { type: 'common', file: 'navigation.json' };
	}
	if (key.includes('hero') || key.includes('features') || key.includes('whyChoose') || key.includes('codeExample')) {
		return { type: 'pages', file: 'home.json' };
	}

	// Documentation pages
	if (key.includes('testStructure')) {
		return { type: 'docs', file: 'test-structure.json' };
	}
	if (key.includes('testWriting')) {
		return { type: 'docs', file: 'test-writing-tips.json' };
	}
	if (key.includes('projectSetup')) {
		return { type: 'docs', file: 'project-setup.json' };
	}
	if (key.includes('quickStart')) {
		return { type: 'docs', file: 'quick-start.json' };
	}
	if (key.includes('environmentSetup') || key.includes('EnvironmentSetup')) {
		return { type: 'docs', file: 'environment-setup.json' };
	}
	if (key.includes('globalSetup') || key.includes('GlobalSetup')) {
		return { type: 'docs', file: 'global-setup.json' };
	}
	if (key.includes('testRecorder') || key.includes('TestRecorder')) {
		return { type: 'docs', file: 'test-recorder.json' };
	}
	if (key.includes('promptGuide')) {
		return { type: 'docs', file: 'prompt-guide.json' };
	}
	if (key.includes('vsCodeDebugging') || key.includes('VSCodeDebugging')) {
		return { type: 'docs', file: 'vscode-debugging.json' };
	}
	if (key.includes('cicdSetup') || key.includes('CICDSetup')) {
		return { type: 'docs', file: 'cicd-setup.json' };
	}
	if (key.includes('htmlReporter') || key.includes('HTMLReporter')) {
		return { type: 'docs', file: 'html-reporter.json' };
	}
	if (key.includes('documentation')) {
		return { type: 'pages', file: 'documentation.json' };
	}
	if (key.includes('notFound')) {
		return { type: 'pages', file: 'not-found.json' };
	}

	// Check for specific page patterns by analyzing the key structure
	const keyParts = key.split('.');
	if (keyParts.length >= 2) {
		const pagePattern = keyParts[0];

		// Map page patterns to files
		const pageToFile = {
			quickStartPage: { type: 'docs', file: 'quick-start.json' },
			projectSetupPage: { type: 'docs', file: 'project-setup.json' },
			environmentSetupPage: { type: 'docs', file: 'environment-setup.json' },
			globalSetupPage: { type: 'docs', file: 'global-setup.json' },
			testStructurePage: { type: 'docs', file: 'test-structure.json' },
			testWritingPage: { type: 'docs', file: 'test-writing-tips.json' },
			testRecorderPage: { type: 'docs', file: 'test-recorder.json' },
			promptGuidePage: { type: 'docs', file: 'prompt-guide.json' },
			vsCodeDebuggingPage: { type: 'docs', file: 'vscode-debugging.json' },
			cicdSetupPage: { type: 'docs', file: 'cicd-setup.json' },
			htmlReporterPage: { type: 'docs', file: 'html-reporter.json' },
			documentationPage: { type: 'pages', file: 'documentation.json' },
			notFoundPage: { type: 'pages', file: 'not-found.json' },

			// Additional mappings for variations
			environmentSetup: { type: 'docs', file: 'environment-setup.json' },
			globalSetup: { type: 'docs', file: 'global-setup.json' },
			testRecorder: { type: 'docs', file: 'test-recorder.json' },
			vsCodeDebugging: { type: 'docs', file: 'vscode-debugging.json' },
			cicdSetup: { type: 'docs', file: 'cicd-setup.json' },
			htmlReporter: { type: 'docs', file: 'html-reporter.json' },
			EnvironmentSetup: { type: 'docs', file: 'environment-setup.json' },
			GlobalSetup: { type: 'docs', file: 'global-setup.json' },
			TestRecorder: { type: 'docs', file: 'test-recorder.json' },
			VSCodeDebugging: { type: 'docs', file: 'vscode-debugging.json' },
			CICDSetup: { type: 'docs', file: 'cicd-setup.json' },
			HTMLReporter: { type: 'docs', file: 'html-reporter.json' },
		};

		if (pageToFile[pagePattern]) {
			return pageToFile[pagePattern];
		}
	}

	// Default to common if we can't determine
	return { type: 'common', file: 'ui.json' };
};

console.log('\n🔧 Creating/updating English translation files...');

// Group missing keys by file
const keysByFileType = {};
missingKeys.forEach((key) => {
	const fileInfo = getFileForKey(key);
	const fileKey = `${fileInfo.type}/${fileInfo.file}`;

	if (!keysByFileType[fileKey]) {
		keysByFileType[fileKey] = [];
	}
	keysByFileType[fileKey].push(key);
});

// Create/update English files
Object.entries(keysByFileType).forEach(([fileKey, keys]) => {
	const [type, filename] = fileKey.split('/');
	const dirPath = path.join(__dirname, 'en', type);
	const filePath = path.join(dirPath, filename);

	// Ensure directory exists
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		console.log(`📁 Created directory: ${dirPath}`);
	}

	// Load existing file or create new
	let existingContent = {};
	if (fs.existsSync(filePath)) {
		try {
			existingContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		} catch (error) {
			console.log(`⚠️  Could not parse existing ${filePath}, creating new file`);
		}
	}

	// Add missing keys with placeholder values
	keys.forEach((key) => {
		// Create a reasonable placeholder value
		const placeholder = key
			.split('.')
			.pop()
			.replace(/([A-Z])/g, ' $1')
			.trim();
		const placeholderText = placeholder.charAt(0).toUpperCase() + placeholder.slice(1);

		createNestedObject(existingContent, key, placeholderText);
	});

	// Write updated file
	fs.writeFileSync(filePath, JSON.stringify(existingContent, null, 2));
	console.log(`✅ Updated ${filePath} with ${keys.length} keys`);
});

console.log('\n🔄 Syncing keys across all language files...');

// Get all languages
const languages = fs.readdirSync(__dirname).filter((dir) => {
	const fullPath = path.join(__dirname, dir);
	return fs.statSync(fullPath).isDirectory() && dir.length === 2;
});

console.log(`📂 Languages found: ${languages.join(', ')}`);

// For each language, ensure all files exist with same structure as English
languages.forEach((lang) => {
	if (lang === 'en') return; // Skip English, we just updated it

	console.log(`\n🌍 Processing ${lang}...`);

	// For each English file, ensure the same file exists in this language
	['common', 'pages', 'docs'].forEach((type) => {
		const englishTypeDir = path.join(__dirname, 'en', type);
		const langTypeDir = path.join(__dirname, lang, type);

		if (!fs.existsSync(englishTypeDir)) return;

		// Ensure language directory exists
		if (!fs.existsSync(langTypeDir)) {
			fs.mkdirSync(langTypeDir, { recursive: true });
			console.log(`  📁 Created directory: ${langTypeDir}`);
		}

		// Process each English file
		const englishFiles = fs.readdirSync(englishTypeDir).filter((f) => f.endsWith('.json'));
		englishFiles.forEach((filename) => {
			const englishFilePath = path.join(englishTypeDir, filename);
			const langFilePath = path.join(langTypeDir, filename);

			try {
				const englishContent = JSON.parse(fs.readFileSync(englishFilePath, 'utf8'));

				// Load existing language file or create new
				let langContent = {};
				if (fs.existsSync(langFilePath)) {
					try {
						langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
					} catch (error) {
						console.log(`    ⚠️  Could not parse ${langFilePath}, creating new`);
					}
				}

				// Function to merge structures, keeping existing translations
				const mergeStructures = (english, existing) => {
					const result = { ...existing };

					for (const [key, value] of Object.entries(english)) {
						if (typeof value === 'object' && value !== null) {
							if (!(key in result)) {
								result[key] = {};
							}
							result[key] = mergeStructures(value, result[key] || {});
						} else {
							// Keep existing translation if it exists, otherwise use English as fallback
							if (!(key in result)) {
								result[key] = value; // English fallback
							}
						}
					}

					return result;
				};

				const mergedContent = mergeStructures(englishContent, langContent);

				// Write updated file
				fs.writeFileSync(langFilePath, JSON.stringify(mergedContent, null, 2));
				console.log(`    ✅ Updated ${type}/${filename}`);
			} catch (error) {
				console.log(`    ❌ Error processing ${filename}: ${error.message}`);
			}
		});
	});
});

// Export the results for the next step
const auditResults = {
	allKeys: Array.from(allKeys),
	keysByFile,
	missingKeys,
	englishTranslations,
	languages,
	keysByFileType,
};

fs.writeFileSync(path.join(__dirname, 'audit-results.json'), JSON.stringify(auditResults, null, 2));

console.log('\n💾 Audit results saved to audit-results.json');
console.log('\n🎉 Process completed!');
console.log('\nWhat was done:');
console.log('✅ Created/updated English translation files with missing keys');
console.log('✅ Synced all keys across all language files');
console.log('✅ Added English fallbacks for missing translations');
console.log('\nNext steps:');
console.log('1. Review the created/updated files');
console.log('2. Update English placeholders with proper text');
console.log('3. Translate remaining English text in other languages');
console.log('4. Run sync-translations script to update main website');
