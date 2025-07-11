# Security Policy

## Supported Versions

We support the latest version of the translation files and actively maintain security for:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in the translation files or build process, please report it responsibly:

### For Security Issues:
- **Email**: security@endorphin.ai
- **Subject**: [SECURITY] Translation Repository Vulnerability
- **Response Time**: We aim to respond within 48 hours

### What to Include:
1. Description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact assessment
4. Any suggested fixes (if available)

### What We Do:
1. **Acknowledge** your report within 48 hours
2. **Investigate** the issue promptly
3. **Fix** confirmed vulnerabilities
4. **Credit** responsible reporters (unless you prefer anonymity)

## Security Considerations

### For Contributors:
- Do not include sensitive information in translation files
- Be aware that all contributions are public
- Verify JSON syntax to prevent parsing vulnerabilities
- Report suspicious content or injection attempts

### For Build Process:
- The build script only processes JSON files
- No external dependencies are required
- All operations are read-only except for the build output
- Validation occurs before any build operations

## Safe Translation Practices

### Content Security:
- Translate only the text values, never keys
- Preserve HTML escaping and special characters
- Do not modify code examples or technical syntax
- Report any malicious content in existing translations

### File Security:
- Only edit `.json` files in language directories
- Do not modify build scripts without proper review
- Validate JSON syntax before committing
- Use proper encoding (UTF-8) for all files

## Automated Security

We use GitHub Actions to:
- Validate JSON syntax automatically
- Check for common security patterns
- Verify file structure integrity
- Test build processes

Thank you for helping keep the Endorphin AI translation project secure!