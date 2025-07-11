#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Extracting ALL text from pages and components...');

// Get all TypeScript/JSX files from src/pages and src/components
const getAllSourceFiles = () => {
  const files = [];
  
  // Get all pages
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join('src/pages', f));
    files.push(...pageFiles);
  }
  
  // Get all components
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  if (fs.existsSync(componentsDir)) {
    const componentFiles = fs.readdirSync(componentsDir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => path.join('src/components', f));
    files.push(...componentFiles);
  }
  
  return files;
};

// Extract hardcoded text from a file
const extractTextFromFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    if (!fs.existsSync(fullPath)) {
      return { texts: [], hasTranslations: false };
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file already uses translations
    const hasTranslations = content.includes('useTranslation') && content.includes('t(');
    
    const texts = [];
    
    // Extract text from JSX elements like <h1>Text</h1>
    const jsxTextPattern = />([^<>{}\n]+)</g;
    let match;
    while ((match = jsxTextPattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && 
          !text.match(/^\s*$/) && 
          !text.startsWith('{') && 
          !text.startsWith('t(') &&
          !text.match(/^(w-|h-|text-|bg-|border-|rounded|flex|items|justify|gap|space|mb-|mt-|mr-|ml-|p-|px-|py-|m-|mx-|my-)/) &&
          text.length > 2) {
        texts.push({
          type: 'jsx-text',
          text: text,
          context: 'JSX element content'
        });
      }
    }
    
    // Extract string literals in quotes
    const stringLiteralPattern = /["']([^"'\\n]{3,}?)["']/g;
    while ((match = stringLiteralPattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && 
          !text.match(/^(className|class|id|src|href|alt|placeholder)$/) &&
          !text.match(/^(w-|h-|text-|bg-|border-|rounded|flex|items|justify|gap|space|mb-|mt-|mr-|ml-|p-|px-|py-|m-|mx-|my-)/) &&
          !text.match(/^\\./) && // CSS classes
          !text.match(/^#/) && // Colors
          !text.match(/^\\//) && // Routes
          !text.match(/^https?:\/\//) && // URLs
          text.length > 2) {
        texts.push({
          type: 'string-literal',
          text: text,
          context: 'String literal'
        });
      }
    }
    
    // Extract aria-label and title attributes
    const ariaLabelPattern = /aria-label=["']([^"']+)["']/g;
    while ((match = ariaLabelPattern.exec(content)) !== null) {
      texts.push({
        type: 'aria-label',
        text: match[1],
        context: 'Accessibility label'
      });
    }
    
    const titlePattern = /title=["']([^"']+)["']/g;
    while ((match = titlePattern.exec(content)) !== null) {
      texts.push({
        type: 'title',
        text: match[1],
        context: 'Title attribute'
      });
    }
    
    // Remove duplicates
    const uniqueTexts = texts.filter((item, index, self) => 
      index === self.findIndex(t => t.text === item.text)
    );
    
    return { texts: uniqueTexts, hasTranslations };
  } catch (error) {
    console.log(`❌ Error reading ${filePath}: ${error.message}`);
    return { texts: [], hasTranslations: false };
  }
};

// Generate translation key from text
const generateTranslationKey = (text, context) => {
  // Clean the text and create a camelCase key
  const cleaned = text
    .replace(/[^\w\s]/g, '') // Remove special characters
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 0)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
  
  return cleaned || 'untitled';
};

// Determine which translation file a page should use
const getTranslationFileForPage = (filePath) => {
  const fileName = path.basename(filePath, '.tsx');
  
  // Map page files to translation namespaces
  const pageMapping = {
    'index': { type: 'pages', file: 'home.json' },
    'Documentation': { type: 'pages', file: 'documentation.json' },
    'NotFound': { type: 'pages', file: 'not-found.json' },
    'QuickStart': { type: 'docs', file: 'quick-start.json' },
    'ProjectSetup': { type: 'docs', file: 'project-setup.json' },
    'EnvironmentSetup': { type: 'docs', file: 'environment-setup.json' },
    'GlobalSetup': { type: 'docs', file: 'global-setup.json' },
    'TestStructure': { type: 'docs', file: 'test-structure.json' },
    'TestWritingTips': { type: 'docs', file: 'test-writing-tips.json' },
    'TestRecorder': { type: 'docs', file: 'test-recorder.json' },
    'PromptGuide': { type: 'docs', file: 'prompt-guide.json' },
    'VSCodeDebugging': { type: 'docs', file: 'vscode-debugging.json' },
    'CICDSetup': { type: 'docs', file: 'cicd-setup.json' },
    'HTMLReporter': { type: 'docs', file: 'html-reporter.json' }
  };
  
  return pageMapping[fileName] || { type: 'common', file: 'ui.json' };
};

// Get translation file for components
const getTranslationFileForComponent = (filePath) => {
  const fileName = path.basename(filePath, '.tsx');
  
  const componentMapping = {
    'Header': { type: 'common', file: 'navigation.json' },
    'Footer': { type: 'common', file: 'navigation.json' },
    'LanguageSwitcher': { type: 'common', file: 'navigation.json' },
    'HeroSection': { type: 'pages', file: 'home.json' },
    'FeaturesSection': { type: 'pages', file: 'home.json' },
    'WhyChooseUsSection': { type: 'pages', file: 'home.json' },
    'CodeExampleSection': { type: 'pages', file: 'home.json' }
  };
  
  return componentMapping[fileName] || { type: 'common', file: 'ui.json' };
};

console.log('📂 Scanning all source files...');

const sourceFiles = getAllSourceFiles();
const results = {};

// Process each file
sourceFiles.forEach(filePath => {
  const result = extractTextFromFile(filePath);
  const fileName = path.basename(filePath, '.tsx');
  
  console.log(`\n📄 ${filePath}:`);
  console.log(`  Uses translations: ${result.hasTranslations ? '✅' : '❌'}`);
  console.log(`  Hardcoded texts found: ${result.texts.length}`);
  
  if (result.texts.length > 0) {
    console.log(`  Examples:`);
    result.texts.slice(0, 3).forEach(item => {
      console.log(`    - "${item.text}" (${item.context})`);
    });
    if (result.texts.length > 3) {
      console.log(`    ... and ${result.texts.length - 3} more`);
    }
  }
  
  results[filePath] = result;
});

console.log('\n🔧 Generating translation files...');

// Group texts by translation file
const translationFiles = {};

Object.entries(results).forEach(([filePath, result]) => {
  if (result.texts.length === 0) return;
  
  const isComponent = filePath.includes('src/components');
  const translationInfo = isComponent ? 
    getTranslationFileForComponent(filePath) : 
    getTranslationFileForPage(filePath);
  
  const fileKey = `${translationInfo.type}/${translationInfo.file}`;
  
  if (!translationFiles[fileKey]) {
    translationFiles[fileKey] = {
      texts: [],
      sourceFiles: []
    };
  }
  
  translationFiles[fileKey].texts.push(...result.texts);
  translationFiles[fileKey].sourceFiles.push(filePath);
});

// Create/update translation files
Object.entries(translationFiles).forEach(([fileKey, data]) => {
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
      console.log(`📝 Loading existing: ${filePath}`);
    } catch (error) {
      console.log(`⚠️  Could not parse existing ${filePath}, creating new file`);
    }
  }
  
  // Determine the root key based on filename
  let rootKey = '';
  if (type === 'docs') {
    rootKey = filename.replace('.json', '').replace(/-/g, '') + 'Page';
  } else if (type === 'pages') {
    if (filename === 'home.json') {
      rootKey = 'homePage';
    } else {
      rootKey = filename.replace('.json', '').replace(/-/g, '') + 'Page';
    }
  } else {
    rootKey = 'common';
  }
  
  // Initialize root object if it doesn't exist
  if (!existingContent[rootKey]) {
    existingContent[rootKey] = {};
  }
  
  // Add texts to translation structure
  const uniqueTexts = data.texts.filter((item, index, self) => 
    index === self.findIndex(t => t.text === item.text)
  );
  
  uniqueTexts.forEach(item => {
    const key = generateTranslationKey(item.text, item.context);
    
    // Create nested structure for better organization
    if (item.context === 'JSX element content') {
      if (!existingContent[rootKey].content) {
        existingContent[rootKey].content = {};
      }
      existingContent[rootKey].content[key] = item.text;
    } else if (item.context === 'Accessibility label') {
      if (!existingContent[rootKey].accessibility) {
        existingContent[rootKey].accessibility = {};
      }
      existingContent[rootKey].accessibility[key] = item.text;
    } else {
      existingContent[rootKey][key] = item.text;
    }
  });
  
  // Write updated file
  fs.writeFileSync(filePath, JSON.stringify(existingContent, null, 2));
  console.log(`✅ Updated ${filePath} with ${uniqueTexts.length} texts from: ${data.sourceFiles.join(', ')}`);
});

console.log('\n📊 Summary:');
console.log(`Total files processed: ${sourceFiles.length}`);
console.log(`Translation files created/updated: ${Object.keys(translationFiles).length}`);

const totalTexts = Object.values(translationFiles).reduce((sum, data) => sum + data.texts.length, 0);
console.log(`Total texts extracted: ${totalTexts}`);

console.log('\n🎉 Text extraction completed!');
console.log('\nNext steps:');
console.log('1. Review the generated translation files');
console.log('2. Update React components to use t() function calls');
console.log('3. Copy translation structure to all languages');
console.log('4. Test the translations work correctly');
