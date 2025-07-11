#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the correct "write tests in English" translations for each language
const languageCorrections = {
	ar: {
		search: /اكتب الاختبارات بالعربية البسيطة|اكتب الاختبارات بالعربية/g,
		replace: 'اكتب الاختبارات بالإنجليزية البسيطة',
	},
	da: {
		search: /Skriv tests på dansk|Skriv tests på enkelt dansk/g,
		replace: 'Skriv tests på enkelt engelsk',
	},
	de: {
		search: /Schreibe Tests in einfachem Deutsch|Tests in deutscher Sprache/g,
		replace: 'Schreibe Tests in einfachem Englisch',
	},
	fi: {
		search: /Kirjoita testit yksinkertaisella suomella|Kirjoita testit suomeksi/g,
		replace: 'Kirjoita testit yksinkertaisella englannilla',
	},
	fr: {
		search: /Écrivez des tests en français simple|Écrivez des tests en français/g,
		replace: 'Écrivez des tests en anglais simple',
	},
	he: {
		search: /כתוב בדיקות בעברית פשוטה|כתוב בדיקות בעברית/g,
		replace: 'כתוב בדיקות באנגלית פשוטה',
	},
	id: {
		search: /Tulis tes dalam bahasa Indonesia sederhana|Tulis tes dalam bahasa Indonesia/g,
		replace: 'Tulis tes dalam bahasa Inggris sederhana',
	},
	it: {
		search: /Scrivi test in italiano semplice|Scrivi test in italiano/g,
		replace: 'Scrivi test in inglese semplice',
	},
	ja: {
		search: /日本語でテストを書く|日本語でテストを書くだけ|簡単な日本語でテストを書く/g,
		replace: 'シンプルな英語でテストを書く',
	},
	ko: {
		search: /간단한 한국어로 테스트 작성|한국어로 테스트 작성/g,
		replace: '간단한 영어로 테스트 작성',
	},
	nl: {
		search: /Schrijf tests in eenvoudig Nederlands|Schrijf tests in Nederlands/g,
		replace: 'Schrijf tests in eenvoudig Engels',
	},
	no: {
		search: /Skriv tester på enkelt norsk|Skriv tester på norsk/g,
		replace: 'Skriv tester på enkelt engelsk',
	},
	pl: {
		search: /Pisz testy w prostym języku polskim|Pisz testy po polsku/g,
		replace: 'Pisz testy w prostym angielskim',
	},
	pt: {
		search: /Escreva testes em português simples|Escreva testes em português/g,
		replace: 'Escreva testes em inglês simples',
	},
	sv: {
		search: /Skriv tester på enkel svenska|Skriv tester på svenska/g,
		replace: 'Skriv tester på enkel engelska',
	},
	tr: {
		search: /Basit Türkçe ile testler yazın|Türkçe ile testler yazın/g,
		replace: 'Basit İngilizce ile testler yazın',
	},
	ua: {
		search: /Пишіть тести простою українською|Пишіть тести українською/g,
		replace: 'Пишіть тести простою англійською',
	},
	zh: {
		search: /用简单的中文编写测试|用中文编写测试/g,
		replace: '用简单的英语编写测试',
	},
};

// Also fix the "describe user actions in X language" part
const actionDescriptionCorrections = {
	ar: {
		search: /صف إجراءات المستخدم بالعربية البسيطة|صف إجراءات المستخدم بالعربية/g,
		replace: 'صف إجراءات المستخدم بالإنجليزية البسيطة',
	},
	da: {
		search: /Beskriv brugerhandlinger på dansk|Beskriv brugerhandlinger på enkelt dansk/g,
		replace: 'Beskriv brugerhandlinger på enkelt engelsk',
	},
	de: {
		search: /Beschreibe Benutzeraktionen in einfachem Deutsch|Beschreibe Benutzeraktionen auf Deutsch/g,
		replace: 'Beschreibe Benutzeraktionen in einfachem Englisch',
	},
	fi: {
		search: /Kuvaile käyttäjän toimintoja yksinkertaisella suomella|Kuvaile käyttäjän toimintoja suomeksi/g,
		replace: 'Kuvaile käyttäjän toimintoja yksinkertaisella englannilla',
	},
	fr: {
		search: /Décrivez les actions utilisateur en français simple|Décrivez les actions utilisateur en français/g,
		replace: 'Décrivez les actions utilisateur en anglais simple',
	},
	he: {
		search: /תאר את פעולות המשתמש בעברית פשוטה|תאר את פעולות המשתמש בעברית/g,
		replace: 'תאר את פעולות המשתמש באנגלית פשוטה',
	},
	id: {
		search: /Deskripsikan tindakan pengguna dalam bahasa Indonesia sederhana|Deskripsikan tindakan pengguna dalam bahasa Indonesia/g,
		replace: 'Deskripsikan tindakan pengguna dalam bahasa Inggris sederhana',
	},
	it: {
		search: /Descrivi le azioni dell'utente in italiano semplice|Descrivi le azioni dell'utente in italiano/g,
		replace: "Descrivi le azioni dell'utente in inglese semplice",
	},
	ja: {
		search: /ユーザーアクションを日本語で説明|ユーザーアクションを簡単な日本語で説明/g,
		replace: 'ユーザーアクションをシンプルな英語で説明',
	},
	ko: {
		search: /사용자 작업을 한국어로 설명|사용자 작업을 간단한 한국어로 설명/g,
		replace: '사용자 작업을 간단한 영어로 설명',
	},
	nl: {
		search: /Beschrijf gebruikersacties in eenvoudig Nederlands|Beschrijf gebruikersacties in Nederlands/g,
		replace: 'Beschrijf gebruikersacties in eenvoudig Engels',
	},
	no: {
		search: /Beskriv brukerhandlinger på enkelt norsk|Beskriv brukerhandlinger på norsk/g,
		replace: 'Beskriv brukerhandlinger på enkelt engelsk',
	},
	pl: {
		search: /Opisz działania użytkownika w prostym języku polskim|Opisz działania użytkownika po polsku/g,
		replace: 'Opisz działania użytkownika w prostym angielskim',
	},
	pt: {
		search: /Descreva ações do usuário em português simples|Descreva ações do usuário em português/g,
		replace: 'Descreva ações do usuário em inglês simples',
	},
	sv: {
		search: /Beskriv användaråtgärder på enkel svenska|Beskriv användaråtgärder på svenska/g,
		replace: 'Beskriv användaråtgärder på enkel engelska',
	},
	tr: {
		search: /Kullanıcı eylemlerini basit Türkçe ile açıklayın|Kullanıcı eylemlerini Türkçe ile açıklayın/g,
		replace: 'Kullanıcı eylemlerini basit İngilizce ile açıklayın',
	},
	ua: {
		search: /Опишіть дії користувача простою українською|Опишіть дії користувача українською/g,
		replace: 'Опишіть дії користувача простою англійською',
	},
	zh: {
		search: /用简单的中文描述用户操作|用中文描述用户操作/g,
		replace: '用简单的英语描述用户操作',
	},
};

console.log('🔧 Fixing language reference issues in all translations...');

let totalFixed = 0;
let filesProcessed = 0;

// Process each language directory
for (const lang of Object.keys(languageCorrections)) {
	const homeFilePath = path.join(lang, 'pages', 'home.json');

	if (fs.existsSync(homeFilePath)) {
		filesProcessed++;
		console.log(`\n📝 Processing ${lang}/pages/home.json...`);

		try {
			let content = fs.readFileSync(homeFilePath, 'utf8');
			let changes = 0;

			// Apply main subtitle correction
			const mainCorrection = languageCorrections[lang];
			if (mainCorrection && content.match(mainCorrection.search)) {
				content = content.replace(mainCorrection.search, mainCorrection.replace);
				changes++;
				console.log(`  ✅ Fixed main subtitle for ${lang}`);
			}

			// Apply action description correction
			const actionCorrection = actionDescriptionCorrections[lang];
			if (actionCorrection && content.match(actionCorrection.search)) {
				content = content.replace(actionCorrection.search, actionCorrection.replace);
				changes++;
				console.log(`  ✅ Fixed action description for ${lang}`);
			}

			// Write back if changes were made
			if (changes > 0) {
				fs.writeFileSync(homeFilePath, content, 'utf8');
				totalFixed += changes;
				console.log(`  💾 Saved ${changes} changes to ${homeFilePath}`);
			} else {
				console.log(`  ℹ️  No changes needed for ${lang}`);
			}
		} catch (error) {
			console.error(`  ❌ Error processing ${homeFilePath}:`, error.message);
		}
	} else {
		console.log(`⚠️  File not found: ${homeFilePath}`);
	}
}

console.log(`\n📊 Summary:`);
console.log(`Files processed: ${filesProcessed}`);
console.log(`Total fixes applied: ${totalFixed}`);
console.log(`\n🎉 Language reference fixes completed!`);
