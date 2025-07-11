const fs = require('fs');
const path = require('path');

// Translations for the missing keys
const translations = {
  'ar': {
    'ecommerceProductTesting': {
      'title': 'اختبار منتجات التجارة الإلكترونية',
      'description': 'توليد بيانات كتالوج المنتجات لاختبار التجارة الإلكترونية الشامل:'
    },
    'complexBusinessScenarios': {
      'title': 'سيناريوهات الأعمال المعقدة',
      'description': 'إنشاء سير عمل تجاري متطور مع بيانات مُولدة بالذكاء الاصطناعي:'
    }
  },
  'da': {
    'ecommerceProductTesting': {
      'title': 'E-handel Produkttest',
      'description': 'Generer produktkatalogdata til omfattende e-handel test:'
    },
    'complexBusinessScenarios': {
      'title': 'Komplekse Forretningsscenarier',
      'description': 'Skab sofistikerede forretningsworkflows med AI-genererede data:'
    }
  },
  'he': {
    'ecommerceProductTesting': {
      'title': 'בדיקת מוצרי מסחר אלקטרוני',
      'description': 'יצירת נתוני קטלוג מוצרים לבדיקת מסחר אלקטרוני מקיפה:'
    },
    'complexBusinessScenarios': {
      'title': 'תרחישים עסקיים מורכבים',
      'description': 'יצירת זרימות עבודה עסקיות מתוחכמות עם נתונים שנוצרו על ידי AI:'
    }
  },
  'id': {
    'ecommerceProductTesting': {
      'title': 'Pengujian Produk E-commerce',
      'description': 'Hasilkan data katalog produk untuk pengujian e-commerce yang komprehensif:'
    },
    'complexBusinessScenarios': {
      'title': 'Skenario Bisnis Kompleks',
      'description': 'Buat alur kerja bisnis yang canggih dengan data yang dihasilkan AI:'
    }
  },
  'it': {
    'ecommerceProductTesting': {
      'title': 'Test Prodotti E-commerce',
      'description': 'Genera dati del catalogo prodotti per test e-commerce completi:'
    },
    'complexBusinessScenarios': {
      'title': 'Scenari Aziendali Complessi',
      'description': 'Crea flussi di lavoro aziendali sofisticati con dati generati dall\'AI:'
    }
  },
  'ja': {
    'ecommerceProductTesting': {
      'title': 'Eコマース製品テスト',
      'description': '包括的なEコマーステストのために製品カタログデータを生成:'
    },
    'complexBusinessScenarios': {
      'title': '複雑なビジネスシナリオ',
      'description': 'AI生成データで洗練されたビジネスワークフローを作成:'
    }
  },
  'ko': {
    'ecommerceProductTesting': {
      'title': '전자상거래 제품 테스트',
      'description': '포괄적인 전자상거래 테스트를 위한 제품 카탈로그 데이터 생성:'
    },
    'complexBusinessScenarios': {
      'title': '복잡한 비즈니스 시나리오',
      'description': 'AI 생성 데이터로 정교한 비즈니스 워크플로우 생성:'
    }
  },
  'nl': {
    'ecommerceProductTesting': {
      'title': 'E-commerce Product Testing',
      'description': 'Genereer productcatalogusgegevens voor uitgebreide e-commerce tests:'
    },
    'complexBusinessScenarios': {
      'title': 'Complexe Bedrijfsscenario\'s',
      'description': 'Creëer geavanceerde bedrijfsworkflows met AI-gegenereerde data:'
    }
  },
  'no': {
    'ecommerceProductTesting': {
      'title': 'E-handel Produkttesting',
      'description': 'Generer produktkatalogdata for omfattende e-handel testing:'
    },
    'complexBusinessScenarios': {
      'title': 'Komplekse Forretningsscenarier',
      'description': 'Lag sofistikerte forretningsarbeidsflyter med AI-genererte data:'
    }
  },
  'pl': {
    'ecommerceProductTesting': {
      'title': 'Testowanie Produktów E-commerce',
      'description': 'Generuj dane katalogu produktów do kompleksowych testów e-commerce:'
    },
    'complexBusinessScenarios': {
      'title': 'Złożone Scenariusze Biznesowe',
      'description': 'Twórz zaawansowane przepływy pracy biznesowej z danymi generowanymi przez AI:'
    }
  },
  'pt': {
    'ecommerceProductTesting': {
      'title': 'Teste de Produtos E-commerce',
      'description': 'Gere dados de catálogo de produtos para testes abrangentes de e-commerce:'
    },
    'complexBusinessScenarios': {
      'title': 'Cenários de Negócios Complexos',
      'description': 'Crie fluxos de trabalho empresariais sofisticados com dados gerados por IA:'
    }
  },
  'sv': {
    'ecommerceProductTesting': {
      'title': 'E-handel Produkttestning',
      'description': 'Generera produktkatalogdata för omfattande e-handelstester:'
    },
    'complexBusinessScenarios': {
      'title': 'Komplexa Affärsscenarier',
      'description': 'Skapa sofistikerade affärsarbetsflöden med AI-genererade data:'
    }
  },
  'tr': {
    'ecommerceProductTesting': {
      'title': 'E-ticaret Ürün Testleri',
      'description': 'Kapsamlı e-ticaret testleri için ürün katalog verisi oluşturun:'
    },
    'complexBusinessScenarios': {
      'title': 'Karmaşık İş Senaryoları',
      'description': 'AI tarafından oluşturulan verilerle gelişmiş iş akışları oluşturun:'
    }
  },
  'ua': {
    'ecommerceProductTesting': {
      'title': 'Тестування Продуктів E-commerce',
      'description': 'Генеруйте дані каталогу продуктів для комплексного тестування e-commerce:'
    },
    'complexBusinessScenarios': {
      'title': 'Складні Бізнес-сценарії',
      'description': 'Створюйте складні бізнес-процеси з даними, згенерованими ШІ:'
    }
  },
  'zh': {
    'ecommerceProductTesting': {
      'title': '电商产品测试',
      'description': '生成产品目录数据进行全面的电商测试:'
    },
    'complexBusinessScenarios': {
      'title': '复杂业务场景',
      'description': '使用AI生成的数据创建复杂的业务工作流程:'
    }
  },
  'fi': {
    'ecommerceProductTesting': {
      'title': 'E-kaupan Tuotetestaus',
      'description': 'Luo tuoteluettelotietoja kattavaa e-kaupan testausta varten:'
    },
    'complexBusinessScenarios': {
      'title': 'Monimutkaiset Liiketoimintaskenaariot',
      'description': 'Luo kehittyneitä liiketoimintatyönkulkuja AI-generoidulla datalla:'
    }
  }
};

// Languages that need to be updated (excluding en, es, fr, de which are already done)
const languagesToUpdate = ['ar', 'da', 'he', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt', 'sv', 'tr', 'ua', 'zh', 'fi'];

languagesToUpdate.forEach(lang => {
  const filePath = path.join(__dirname, `${lang}/docs/test-structure.json`);
  
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Add the missing keys to the aiPoweredData section
      if (data.testStructurePage && data.testStructurePage.aiPoweredData) {
        data.testStructurePage.aiPoweredData.ecommerceProductTesting = translations[lang].ecommerceProductTesting;
        data.testStructurePage.aiPoweredData.complexBusinessScenarios = translations[lang].complexBusinessScenarios;
        
        // Write back the updated content
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Updated ${lang}/docs/test-structure.json`);
      } else {
        console.log(`❌ Missing aiPoweredData section in ${lang}/docs/test-structure.json`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${lang}/docs/test-structure.json:`, error.message);
    }
  } else {
    console.log(`❌ File not found: ${lang}/docs/test-structure.json`);
  }
});

console.log('\n🎉 Translation update completed!');
