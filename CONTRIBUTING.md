# Contributing to Endorphin AI Translations

Thank you for your interest in helping translate the Endorphin AI website! This guide will help you contribute effectively.

## 🌍 Translation Overview

The Endorphin AI website supports **20 languages** with a modular translation system:

-   **Common Components**: Navigation, footer, error messages
-   **Main Pages**: Homepage, documentation index, cost transparency
-   **Documentation Pages**: Guides for using Endorphin AI

## 🚀 Quick Start

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/endorphin-ai-translations.git
cd endorphin-ai-translations
```

### 2. Choose Your Language

Navigate to your language folder (e.g., `en/`, `es/`, `fr/`, etc.)

### 3. Edit Translation Files

Each file contains JSON with translation keys and values:

```json
{
	"nav": {
		"features": "Features",
		"documentation": "Documentation",
		"github": "GitHub"
	}
}
```

**Only translate the values, never the keys!**

### 4. Submit Your Changes

```bash
git add .
git commit -m "Update [language] translations for [component]"
git push origin your-branch-name
```

Create a Pull Request with your changes.

## 📁 File Structure

### Common Components

-   `common/navigation.json` - Site navigation menu
-   `common/footer.json` - Site footer links and text
-   `common/errors.json` - Error pages (404, etc.)

### Main Pages

-   `pages/home.json` - Homepage content (hero section, features, etc.)
-   `pages/documentation.json` - Documentation index page
-   `pages/cost-transparency.json` - Cost transparency page

### Documentation Pages

-   `docs/quick-start.json` - Quick start guide
-   `docs/project-setup.json` - Project setup instructions
-   `docs/environment-setup.json` - Environment setup guide
-   `docs/global-setup.json` - Global setup configuration
-   `docs/test-structure.json` - Test structure guide
-   `docs/test-writing-tips.json` - Test writing best practices
-   `docs/test-recorder.json` - Test recorder documentation
-   `docs/prompt-guide.json` - AI prompt guide
-   `docs/html-reporter.json` - HTML reporter documentation
-   `docs/vscode-debugging.json` - VS Code debugging guide
-   `docs/cicd-setup.json` - CI/CD setup instructions

## ✅ Translation Guidelines

### DO:

-   ✅ Translate only the text values, not the keys
-   ✅ Keep the JSON structure intact
-   ✅ Preserve code examples and command snippets
-   ✅ Maintain consistent terminology within your language
-   ✅ Use native terminology for technical concepts when appropriate
-   ✅ Test your JSON syntax (use a JSON validator)

### DON'T:

-   ❌ Change or translate the JSON keys
-   ❌ Modify the file structure
-   ❌ Translate code examples, file names, or command syntax
-   ❌ Remove or add new JSON fields
-   ❌ Translate brand names (Endorphin AI, GitHub, etc.)

## 🎯 Language-Specific Guidelines

### Technical Terms

-   Keep API-related terms in English: "API key", "endpoint", "JSON"
-   Translate user interface elements: "button", "menu", "page"
-   For programming terms, use established local conventions

### Tone and Style

-   **Formal languages** (German, Japanese): Use formal/polite forms
-   **Casual languages** (English, Dutch): Use friendly, approachable tone
-   **Technical content**: Maintain clarity and precision
-   **Marketing content**: Adapt to local marketing conventions

## 🔧 Technical Requirements

### JSON Format

-   Use proper JSON syntax with quotes around keys and string values
-   Maintain proper indentation (2 spaces)
-   Ensure commas are correctly placed
-   End files with a newline character

### Character Encoding

-   Use UTF-8 encoding for all files
-   Special characters and emojis are preserved as-is
-   Right-to-left languages (Arabic, Hebrew) use standard JSON format

### Testing

Before submitting, verify:

1. JSON files are valid (use [jsonlint.com](https://jsonlint.com))
2. No missing or extra commas
3. All strings are properly quoted
4. File structure matches the original

## 🌐 Supported Languages

| Language   | Code | Status      | Contributors |
| ---------- | ---- | ----------- | ------------ |
| English    | `en` | ✅ Complete | Core team    |
| Arabic     | `ar` | ✅ Complete | Community    |
| Chinese    | `zh` | ✅ Complete | Community    |
| Danish     | `da` | ✅ Complete | Community    |
| Dutch      | `nl` | ✅ Complete | Community    |
| Finnish    | `fi` | ✅ Complete | Community    |
| French     | `fr` | ✅ Complete | Community    |
| German     | `de` | ✅ Complete | Community    |
| Hebrew     | `he` | ✅ Complete | Community    |
| Indonesian | `id` | ✅ Complete | Community    |
| Italian    | `it` | ✅ Complete | Community    |
| Japanese   | `ja` | ✅ Complete | Community    |
| Korean     | `ko` | ✅ Complete | Community    |
| Norwegian  | `no` | ✅ Complete | Community    |
| Polish     | `pl` | ✅ Complete | Community    |
| Portuguese | `pt` | ✅ Complete | Community    |
| Spanish    | `es` | ✅ Complete | Community    |
| Swedish    | `sv` | ✅ Complete | Community    |
| Turkish    | `tr` | ✅ Complete | Community    |
| Ukrainian  | `ua` | ✅ Complete | Community    |

## 🆕 Adding New Languages

To add a new language:

1. **Create Language Directory**: `mkdir new-language-code`
2. **Copy English Structure**: `cp -r en/* new-language-code/`
3. **Translate All Files**: Update all JSON files with translations
4. **Update Documentation**: Add language to README.md and this file
5. **Submit PR**: Include all files for the new language

## 💡 Translation Tips

### For Maintainers

-   Use consistent terminology across all files
-   Create a glossary for technical terms in your language
-   Review other contributors' work in your language
-   Help newcomers with language-specific conventions

### For New Contributors

-   Start with smaller files like `common/navigation.json`
-   Ask questions in issues if terminology is unclear
-   Look at existing translations for context
-   Don't hesitate to suggest improvements to source text

### Quality Assurance

-   Native speakers are preferred for reviewing translations
-   Technical accuracy is as important as linguistic correctness
-   Consider cultural context and local conventions
-   Test how translations look in the actual website

## 🎉 Recognition

All contributors are recognized in the project:

-   Contributors list in README.md
-   Git history preserves all contributions
-   Community showcase for major contributors
-   Optional: Add yourself to contributors section

## 📞 Getting Help

-   **Issues**: Create GitHub issues for questions
-   **Discussions**: Use GitHub Discussions for general questions
-   **Discord**: Join our community Discord for real-time help
-   **Email**: translations@endorphin.ai for private questions

## 📄 License

By contributing translations, you agree that your contributions will be licensed under the same license as the Endorphin AI project.

---

**Thank you for helping make Endorphin AI accessible to users worldwide! 🌍**
