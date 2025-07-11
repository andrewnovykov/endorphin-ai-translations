const fs = require('fs');
const path = require('path');

// Languages to check
const languages = [
	'ar',
	'da',
	'de',
	'en',
	'es',
	'fi',
	'fr',
	'he',
	'id',
	'it',
	'ja',
	'ko',
	'nl',
	'no',
	'pl',
	'pt',
	'sv',
	'tr',
	'ua',
	'zh',
];

// Correct translations for each language
const corrections = {
	ar: {
		subtitle:
			'اكتب الاختبارات بالإنجليزية البسيطة. دع الذكاء الاصطناعي يولدها ويتحقق منها ويصلحها تلقائياً. مستقبل اختبارات الطرف إلى الطرف.',
		description: 'صف إجراءات المستخدم بالإنجليزية البسيطة',
	},
	da: {
		subtitle:
			'Skriv tests på almindeligt engelsk. Lad AI generere, validere og rette dem automatisk. Fremtiden for end-to-end testing.',
		description: 'Beskriv brugerhandlinger på almindeligt engelsk',
	},
	de: {
		subtitle:
			'Schreibe Tests in einfachem Englisch. Lass die KI sie automatisch generieren, validieren und beheben. Die Zukunft des End-to-End-Testings.',
		description: 'Beschreibe Benutzeraktionen in einfachem Englisch',
	},
	en: {
		subtitle:
			'Write tests in plain English. Let AI generate, validate, and fix them automatically. The future of end-to-end testing.',
		description: 'Describe user actions in plain English',
	},
	es: {
		subtitle:
			'Escribe pruebas en inglés simple. Deja que la IA las genere, valide y corrija automáticamente. El futuro de las pruebas end-to-end.',
		description: 'Describe acciones del usuario en inglés simple',
	},
	fi: {
		subtitle:
			'Kirjoita testit selkeällä englannilla. Anna tekoälyn generoida, validoida ja korjata ne automaattisesti. End-to-end -testauksen tulevaisuus.',
		description: 'Kuvaile käyttäjän toimintoja selkeällä englannilla',
	},
	fr: {
		subtitle:
			"Écrivez des tests en anglais simple. Laissez l'IA les générer, valider et corriger automatiquement. L'avenir des tests end-to-end.",
		description: 'Décrivez les actions utilisateur en anglais simple',
	},
	he: {
		subtitle:
			'כתוב בדיקות באנגלית פשוטה. תן לבינה מלאכותית ליצור, לאמת ולתקן אותן אוטומטית. העתיד של בדיקות end-to-end.',
		description: 'תאר פעולות משתמש באנגלית פשוטה',
	},
	id: {
		subtitle:
			'Tulis tes dalam bahasa Inggris sederhana. Biarkan AI menghasilkan, memvalidasi, dan memperbaikinya secara otomatis. Masa depan pengujian end-to-end.',
		description: 'Jelaskan tindakan pengguna dalam bahasa Inggris sederhana',
	},
	it: {
		subtitle:
			"Scrivi test in inglese semplice. Lascia che l'IA li generi, validi e corregga automaticamente. Il futuro del testing end-to-end.",
		description: 'Descrivi le azioni utente in inglese semplice',
	},
	ja: {
		subtitle:
			'シンプルな英語でテストを書きます。AIが自動的に生成、検証、修正します。エンドツーエンドテストの未来です。',
		description: 'シンプルな英語でユーザーアクションを記述',
	},
	ko: {
		subtitle:
			'평범한 영어로 테스트를 작성하세요. AI가 자동으로 생성, 검증 및 수정합니다. 엔드투엔드 테스팅의 미래입니다.',
		description: '평범한 영어로 사용자 행동을 설명',
	},
	nl: {
		subtitle:
			'Schrijf tests in gewoon Engels. Laat AI ze automatisch genereren, valideren en repareren. De toekomst van end-to-end testing.',
		description: 'Beschrijf gebruikersacties in gewoon Engels',
	},
	no: {
		subtitle:
			'Skriv tester på vanlig engelsk. La AI generere, validere og fikse dem automatisk. Fremtiden for end-to-end testing.',
		description: 'Beskriv brukerhandlinger på vanlig engelsk',
	},
	pl: {
		subtitle:
			'Pisz testy w prostym angielskim. Pozwól AI wygenerować, zwalidować i naprawić je automatycznie. Przyszłość testowania end-to-end.',
		description: 'Opisz działania użytkownika w prostym angielskim',
	},
	pt: {
		subtitle:
			'Escreva testes em inglês simples. Deixe a IA gerar, validar e corrigir automaticamente. O futuro dos testes end-to-end.',
		description: 'Descreva ações do usuário em inglês simples',
	},
	sv: {
		subtitle:
			'Skriv tester på vanlig engelska. Låt AI generera, validera och fixa dem automatiskt. Framtiden för end-to-end testning.',
		description: 'Beskriv användaråtgärder på vanlig engelska',
	},
	tr: {
		subtitle:
			"Testleri sade İngilizce yazın. AI'nın otomatik olarak oluşturmasına, doğrulamasına ve düzeltmesine izin verin. Uçtan uca testlerin geleceği.",
		description: 'Kullanıcı eylemlerini sade İngilizce tanımlayın',
	},
	ua: {
		subtitle:
			'Пишіть тести простою англійською. Дозвольте ШІ генерувати, перевіряти та виправляти їх автоматично. Майбутнє тестування end-to-end.',
		description: 'Опишіть дії користувача простою англійською',
	},
	zh: {
		subtitle: '用简单的英语编写测试。让AI自动生成、验证和修复它们。端到端测试的未来。',
		description: '用简单的英语描述用户操作',
	},
};

async function fixTranslations() {
	const results = [];

	for (const lang of languages) {
		const filePath = path.join(__dirname, `${lang}/pages/home.json`);

		try {
			if (!fs.existsSync(filePath)) {
				results.push(`${lang}: File not found`);
				continue;
			}

			const content = fs.readFileSync(filePath, 'utf8');
			const data = JSON.parse(content);

			// Check if corrections are needed
			const correction = corrections[lang];
			if (!correction) {
				results.push(`${lang}: No correction defined`);
				continue;
			}

			let needsUpdate = false;

			// Update hero subtitle
			if (data.hero && data.hero.subtitle !== correction.subtitle) {
				data.hero.subtitle = correction.subtitle;
				needsUpdate = true;
			}

			// Update AI-powered description
			if (
				data.features &&
				data.features.aiPowered &&
				data.features.aiPowered.description !== correction.description
			) {
				data.features.aiPowered.description = correction.description;
				needsUpdate = true;
			}

			if (needsUpdate) {
				// Write updated file
				fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
				results.push(`${lang}: Updated translations`);
			} else {
				results.push(`${lang}: Already correct`);
			}
		} catch (error) {
			results.push(`${lang}: Error - ${error.message}`);
		}
	}

	return results;
}

// Run the fix
fixTranslations()
	.then((results) => {
		console.log('Translation Fix Results:');
		results.forEach((result) => console.log(result));
	})
	.catch((error) => {
		console.error('Error:', error);
	});
