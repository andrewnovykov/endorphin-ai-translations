#!/bin/bash

# Fix remaining languages manually
echo "Fixing language references across all translations..."

# Function to fix a language file
fix_language() {
    local lang=$1
    local file="$lang/pages/home.json"
    
    if [ -f "$file" ]; then
        echo "Checking $lang..."
        
        # Create temporary file with fixes based on language
        case $lang in
            "ar")
                sed -i '' 's/اكتب الاختبارات بالعربية البسيطة/اكتب الاختبارات بالإنجليزية البسيطة/g' "$file"
                sed -i '' 's/صف إجراءات المستخدم بالعربية البسيطة/صف إجراءات المستخدم بالإنجليزية البسيطة/g' "$file"
                ;;
            "da")
                sed -i '' 's/Skriv tests på almindeligt dansk/Skriv tests på almindeligt engelsk/g' "$file"
                sed -i '' 's/Beskriv brugerhandlinger på almindeligt dansk/Beskriv brugerhandlinger på almindeligt engelsk/g' "$file"
                ;;
            "fi")
                sed -i '' 's/Kirjoita testit selkeällä suomella/Kirjoita testit selkeällä englannilla/g' "$file"
                sed -i '' 's/Kuvaile käyttäjän toimintoja selkeällä suomella/Kuvaile käyttäjän toimintoja selkeällä englannilla/g' "$file"
                ;;
            "he")
                sed -i '' 's/כתוב בדיקות בעברית פשוטה/כתוב בדיקות באנגלית פשוטה/g' "$file"
                sed -i '' 's/תאר פעולות משתמש בעברית פשוטה/תאר פעולות משתמש באנגלית פשוטה/g' "$file"
                ;;
            "id")
                sed -i '' 's/Tulis tes dalam bahasa Indonesia sederhana/Tulis tes dalam bahasa Inggris sederhana/g' "$file"
                sed -i '' 's/Jelaskan tindakan pengguna dalam bahasa Indonesia sederhana/Jelaskan tindakan pengguna dalam bahasa Inggris sederhana/g' "$file"
                ;;
            "it")
                sed -i '' 's/Scrivi test in italiano semplice/Scrivi test in inglese semplice/g' "$file"
                sed -i '' 's/Descrivi le azioni utente in italiano semplice/Descrivi le azioni utente in inglese semplice/g' "$file"
                ;;
            "ja")
                sed -i '' 's/シンプルな日本語でテストを書きます/シンプルな英語でテストを書きます/g' "$file"
                sed -i '' 's/シンプルな日本語でユーザーアクションを記述/シンプルな英語でユーザーアクションを記述/g' "$file"
                ;;
            "ko")
                sed -i '' 's/평범한 한국어로 테스트를 작성하세요/평범한 영어로 테스트를 작성하세요/g' "$file"
                sed -i '' 's/평범한 한국어로 사용자 행동을 설명/평범한 영어로 사용자 행동을 설명/g' "$file"
                ;;
            "nl")
                sed -i '' 's/Schrijf tests in gewoon Nederlands/Schrijf tests in gewoon Engels/g' "$file"
                sed -i '' 's/Beschrijf gebruikersacties in gewoon Nederlands/Beschrijf gebruikersacties in gewoon Engels/g' "$file"
                ;;
            "no")
                sed -i '' 's/Skriv tester på vanlig norsk/Skriv tester på vanlig engelsk/g' "$file"
                sed -i '' 's/Beskriv brukerhandlinger på vanlig norsk/Beskriv brukerhandlinger på vanlig engelsk/g' "$file"
                ;;
            "pl")
                sed -i '' 's/Pisz testy w prostym polskim/Pisz testy w prostym angielskim/g' "$file"
                sed -i '' 's/Opisz działania użytkownika w prostym polskim/Opisz działania użytkownika w prostym angielskim/g' "$file"
                ;;
            "sv")
                sed -i '' 's/Skriv tester på vanlig svenska/Skriv tester på vanlig engelska/g' "$file"
                sed -i '' 's/Beskriv användaråtgärder på vanlig svenska/Beskriv användaråtgärder på vanlig engelska/g' "$file"
                ;;
            "tr")
                sed -i '' 's/Testleri sade Türkçe yazın/Testleri sade İngilizce yazın/g' "$file"
                sed -i '' 's/Kullanıcı eylemlerini sade Türkçe tanımlayın/Kullanıcı eylemlerini sade İngilizce tanımlayın/g' "$file"
                ;;
            "ua")
                sed -i '' 's/Пишіть тести простою українською/Пишіть тести простою англійською/g' "$file"
                sed -i '' 's/Опишіть дії користувача простою українською/Опишіть дії користувача простою англійською/g' "$file"
                ;;
            "zh")
                sed -i '' 's/用简单的中文编写测试/用简单的英语编写测试/g' "$file"
                sed -i '' 's/用简单的中文描述用户操作/用简单的英语描述用户操作/g' "$file"
                ;;
        esac
        
        echo "Fixed $lang"
    else
        echo "File not found: $file"
    fi
}

# Fix all languages
for lang in ar da fi he id it ja ko nl no pl sv tr ua zh; do
    fix_language $lang
done

echo "Done fixing language references!"
