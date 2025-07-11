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

// Required keys with their English translations
const requiredKeys = {
	ecommerceProductTesting: {
		title: 'E-commerce Product Testing',
		description: 'Generate realistic product data for comprehensive e-commerce testing:',
	},
	complexBusinessScenarios: {
		title: 'Complex Business Scenarios',
		description: 'Generate complete business scenarios with relationships and realistic workflows:',
	},
};

// Language-specific translations
const translations = {
	ar: {
		ecommerceProductTesting: {
			title: 'اختبار منتجات التجارة الإلكترونية',
			description: 'إنشاء بيانات منتجات واقعية لاختبار التجارة الإلكترونية الشامل:',
		},
		complexBusinessScenarios: {
			title: 'سيناريوهات الأعمال المعقدة',
			description: 'إنشاء سيناريوهات أعمال كاملة مع العلاقات وتدفقات العمل الواقعية:',
		},
	},
	da: {
		ecommerceProductTesting: {
			title: 'E-handel Produkttest',
			description: 'Generer realistiske produktdata til omfattende e-handel test:',
		},
		complexBusinessScenarios: {
			title: 'Komplekse Forretningsscenarier',
			description: 'Generer komplette forretningsscenarier med relationer og realistiske workflows:',
		},
	},
	de: {
		ecommerceProductTesting: {
			title: 'E-Commerce-Produkttests',
			description: 'Generieren Sie Produktkatalogdaten für umfassende E-Commerce-Tests:',
		},
		complexBusinessScenarios: {
			title: 'Komplexe Geschäftsszenarien',
			description: 'Erstellen Sie anspruchsvolle Geschäftsabläufe mit KI-generierten Daten:',
		},
	},
	en: {
		ecommerceProductTesting: {
			title: 'E-commerce Product Testing',
			description: 'Generate realistic product data for comprehensive e-commerce testing:',
		},
		complexBusinessScenarios: {
			title: 'Complex Business Scenarios',
			description: 'Generate complete business scenarios with relationships and realistic workflows:',
		},
	},
	es: {
		ecommerceProductTesting: {
			title: 'Pruebas de Productos E-commerce',
			description: 'Genera datos de catálogo de productos para pruebas completas de e-commerce:',
		},
		complexBusinessScenarios: {
			title: 'Escenarios de Negocio Complejos',
			description: 'Genera escenarios de negocio completos con relaciones y flujos de trabajo realistas:',
		},
	},
	fi: {
		ecommerceProductTesting: {
			title: 'Verkkokauppatuotteiden testaus',
			description: 'Luo realistista tuotetietoa kattavaa verkkokauppatestauksia varten:',
		},
		complexBusinessScenarios: {
			title: 'Monimutkaiset liiketoimintaskenaariot',
			description: 'Luo täydellisiä liiketoimintaskenaarioita suhteilla ja realistisilla työnkuluilla:',
		},
	},
	fr: {
		ecommerceProductTesting: {
			title: 'Tests de Produits E-commerce',
			description: 'Générez des données de catalogue de produits pour des tests e-commerce complets:',
		},
		complexBusinessScenarios: {
			title: 'Scénarios Commerciaux Complexes',
			description:
				'Générez des scénarios commerciaux complets avec des relations et des flux de travail réalistes:',
		},
	},
	he: {
		ecommerceProductTesting: {
			title: 'בדיקת מוצרי מסחר אלקטרוני',
			description: 'יצירת נתוני מוצר מציאותיים לבדיקת מסחר אלקטרוני מקיפה:',
		},
		complexBusinessScenarios: {
			title: 'תרחישי עסקים מורכבים',
			description: 'יצירת תרחישי עסקים מלאים עם יחסים וזרימות עבודה מציאותיות:',
		},
	},
	id: {
		ecommerceProductTesting: {
			title: 'Pengujian Produk E-commerce',
			description: 'Hasilkan data produk yang realistis untuk pengujian e-commerce yang komprehensif:',
		},
		complexBusinessScenarios: {
			title: 'Skenario Bisnis Kompleks',
			description: 'Hasilkan skenario bisnis lengkap dengan hubungan dan alur kerja yang realistis:',
		},
	},
	it: {
		ecommerceProductTesting: {
			title: 'Test di Prodotti E-commerce',
			description: 'Genera dati di prodotto realistici per test e-commerce completi:',
		},
		complexBusinessScenarios: {
			title: 'Scenari Aziendali Complessi',
			description: 'Genera scenari aziendali completi con relazioni e flussi di lavoro realistici:',
		},
	},
	ja: {
		ecommerceProductTesting: {
			title: 'Eコマース製品テスト',
			description: '包括的なeコマーステストのための製品カタログデータを生成する:',
		},
		complexBusinessScenarios: {
			title: '複雑なビジネスシナリオ',
			description: 'リアルなワークフローと関係性を持つ完全なビジネスシナリオを生成する:',
		},
	},
	ko: {
		ecommerceProductTesting: {
			title: '이커머스 제품 테스트',
			description: '포괄적인 이커머스 테스트를 위한 현실적인 제품 데이터 생성:',
		},
		complexBusinessScenarios: {
			title: '복잡한 비즈니스 시나리오',
			description: '관계와 현실적인 워크플로우를 가진 완전한 비즈니스 시나리오 생성:',
		},
	},
	nl: {
		ecommerceProductTesting: {
			title: 'E-commerce Product Testing',
			description: 'Genereer realistische productgegevens voor uitgebreide e-commerce tests:',
		},
		complexBusinessScenarios: {
			title: "Complexe Business Scenario's",
			description: "Genereer complete business scenario's met relaties en realistische workflows:",
		},
	},
	no: {
		ecommerceProductTesting: {
			title: 'E-handel Produkttesting',
			description: 'Generer realistiske produktdata for omfattende e-handel testing:',
		},
		complexBusinessScenarios: {
			title: 'Komplekse Forretningsscenarier',
			description: 'Generer komplette forretningsscenarier med relasjoner og realistiske arbeidsflyter:',
		},
	},
	pl: {
		ecommerceProductTesting: {
			title: 'Testowanie Produktów E-commerce',
			description: 'Generuj realistyczne dane produktów do kompleksowego testowania e-commerce:',
		},
		complexBusinessScenarios: {
			title: 'Złożone Scenariusze Biznesowe',
			description: 'Generuj kompletne scenariusze biznesowe z relacjami i realistycznymi przepływami pracy:',
		},
	},
	pt: {
		ecommerceProductTesting: {
			title: 'Testes de Produtos E-commerce',
			description: 'Gere dados de catálogo de produtos para testes completos de e-commerce:',
		},
		complexBusinessScenarios: {
			title: 'Cenários de Negócio Complexos',
			description: 'Gere cenários de negócio completos com relacionamentos e fluxos de trabalho realistas:',
		},
	},
	sv: {
		ecommerceProductTesting: {
			title: 'E-handel Produkttestning',
			description: 'Generera realistiska produktdata för omfattande e-handel testning:',
		},
		complexBusinessScenarios: {
			title: 'Komplexa Affärsscenarier',
			description: 'Generera kompletta affärsscenarier med relationer och realistiska arbetsflöden:',
		},
	},
	tr: {
		ecommerceProductTesting: {
			title: 'E-ticaret Ürün Testi',
			description: 'Kapsamlı e-ticaret testi için gerçekçi ürün verileri oluşturun:',
		},
		complexBusinessScenarios: {
			title: 'Karmaşık İş Senaryoları',
			description: 'İlişkiler ve gerçekçi iş akışları ile tam iş senaryoları oluşturun:',
		},
	},
	ua: {
		ecommerceProductTesting: {
			title: 'Тестування товарів електронної комерції',
			description: 'Генерація реалістичних даних продуктів для комплексного тестування електронної комерції:',
		},
		complexBusinessScenarios: {
			title: 'Складні бізнес-сценарії',
			description: 'Генерація повних бізнес-сценаріїв з відносинами та реалістичними робочими процесами:',
		},
	},
	zh: {
		ecommerceProductTesting: {
			title: '电子商务产品测试',
			description: '为全面的电子商务测试生成现实的产品数据：',
		},
		complexBusinessScenarios: {
			title: '复杂业务场景',
			description: '生成具有关系和现实工作流程的完整业务场景：',
		},
	},
};

async function checkAndUpdateLanguages() {
	const results = [];

	for (const lang of languages) {
		const filePath = path.join(__dirname, `${lang}/docs/test-structure.json`);

		try {
			if (!fs.existsSync(filePath)) {
				results.push(`${lang}: File not found`);
				continue;
			}

			const content = fs.readFileSync(filePath, 'utf8');
			const data = JSON.parse(content);

			// Check if the keys exist in the aiPoweredData section
			const aiPoweredData = data.testStructurePage?.aiPoweredData;
			if (!aiPoweredData) {
				results.push(`${lang}: aiPoweredData section not found`);
				continue;
			}

			let needsUpdate = false;

			// Check each required key
			for (const keyName of Object.keys(requiredKeys)) {
				if (!aiPoweredData[keyName]) {
					needsUpdate = true;
					break;
				}
			}

			if (needsUpdate) {
				// Add missing keys
				const langTranslations = translations[lang] || translations['en'];

				for (const keyName of Object.keys(requiredKeys)) {
					if (!aiPoweredData[keyName]) {
						aiPoweredData[keyName] = langTranslations[keyName];
					}
				}

				// Write updated file
				fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
				results.push(`${lang}: Updated with missing keys`);
			} else {
				results.push(`${lang}: Already has all required keys`);
			}
		} catch (error) {
			results.push(`${lang}: Error - ${error.message}`);
		}
	}

	return results;
}

// Run the check
checkAndUpdateLanguages()
	.then((results) => {
		console.log('Results:');
		results.forEach((result) => console.log(result));
	})
	.catch((error) => {
		console.error('Error:', error);
	});
