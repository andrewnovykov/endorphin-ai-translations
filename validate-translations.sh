#!/bin/bash

# Script to validate all translation files for common issues
# This script checks for:
# 1. JSON syntax errors
# 2. Missing language-specific content (e.g., Spanish text in Italian files)
# 3. Incomplete translations

echo "🔍 Validating translation files..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_FILES=0
VALID_FILES=0
INVALID_FILES=0

# Function to check JSON syntax
check_json_syntax() {
    local file="$1"
    if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
        echo -e "${RED}❌ JSON syntax error in: $file${NC}"
        return 1
    fi
    return 0
}

# Function to check for Spanish text in non-Spanish files
check_spanish_contamination() {
    local file="$1"
    local lang=$(echo "$file" | cut -d'/' -f1)
    
    if [[ "$lang" != "es" ]]; then
        # Check for common Spanish words that shouldn't be in other languages
        if grep -q "Escribe pruebas\|pruebas en español\|automaticamente\|segundo plano" "$file"; then
            echo -e "${RED}❌ Spanish text found in non-Spanish file: $file${NC}"
            return 1
        fi
    fi
    return 0
}

# Function to check for missing English references
check_english_references() {
    local file="$1"
    local lang=$(echo "$file" | cut -d'/' -f1)
    
    # Check if it's a home.json file and contains language-specific "write tests" instruction
    if [[ "$file" == *"/pages/home.json" ]]; then
        case "$lang" in
            "ar") expected_pattern="اكتب الاختبارات بالإنجليزية البسيطة" ;;
            "da") expected_pattern="Skriv tests på enkelt engelsk" ;;
            "de") expected_pattern="Schreibe Tests in einfachem Englisch" ;;
            "es") expected_pattern="Escribe pruebas en inglés simple" ;;
            "fi") expected_pattern="Kirjoita testit yksinkertaisella englannilla" ;;
            "fr") expected_pattern="Écrivez des tests en anglais simple" ;;
            "he") expected_pattern="כתוב בדיקות באנגלית פשוטה" ;;
            "id") expected_pattern="Tulis tes dalam bahasa Inggris sederhana" ;;
            "it") expected_pattern="Scrivi test in inglese semplice" ;;
            "ja") expected_pattern="シンプルな英語でテストを書く" ;;
            "ko") expected_pattern="간단한 영어로 테스트 작성" ;;
            "nl") expected_pattern="Schrijf tests in eenvoudig Engels" ;;
            "no") expected_pattern="Skriv tester på enkelt engelsk" ;;
            "pl") expected_pattern="Pisz testy w prostym angielskim" ;;
            "pt") expected_pattern="Escreva testes em inglês simples" ;;
            "sv") expected_pattern="Skriv tester på enkel engelska" ;;
            "tr") expected_pattern="Basit İngilizce ile testler yazın" ;;
            "ua") expected_pattern="Пишіть тести простою англійською" ;;
            "zh") expected_pattern="用简单的英语编写测试" ;;
            *) return 0 ;;
        esac
        
        if [[ "$lang" != "en" ]] && ! grep -q "$expected_pattern" "$file"; then
            echo -e "${YELLOW}⚠️  May need language-specific 'write tests' instruction: $file${NC}"
            return 1
        fi
    fi
    return 0
}

# Main validation loop
for lang_dir in */; do
    if [[ -d "$lang_dir" ]]; then
        lang=$(basename "$lang_dir")
        echo -e "\n📁 Checking language: ${GREEN}$lang${NC}"
        
        # Find all JSON files in this language directory
        while IFS= read -r -d '' file; do
            TOTAL_FILES=$((TOTAL_FILES + 1))
            relative_file=${file#./}
            
            # Check JSON syntax
            if check_json_syntax "$file"; then
                # Check for Spanish contamination
                if check_spanish_contamination "$relative_file"; then
                    # Check for proper English references
                    if check_english_references "$relative_file"; then
                        VALID_FILES=$((VALID_FILES + 1))
                        echo -e "${GREEN}✅ Valid: $relative_file${NC}"
                    else
                        INVALID_FILES=$((INVALID_FILES + 1))
                    fi
                else
                    INVALID_FILES=$((INVALID_FILES + 1))
                fi
            else
                INVALID_FILES=$((INVALID_FILES + 1))
            fi
        done < <(find "$lang_dir" -name "*.json" -type f -print0)
    fi
done

# Summary
echo -e "\n📊 Validation Summary:"
echo -e "Total files checked: $TOTAL_FILES"
echo -e "${GREEN}Valid files: $VALID_FILES${NC}"
echo -e "${RED}Invalid files: $INVALID_FILES${NC}"

if [[ $INVALID_FILES -eq 0 ]]; then
    echo -e "\n🎉 All translation files are valid!"
    exit 0
else
    echo -e "\n❌ Found $INVALID_FILES invalid files that need attention."
    exit 1
fi
