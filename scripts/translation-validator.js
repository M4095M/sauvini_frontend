#!/usr/bin/env node

/**
 * Translation Key Extractor and Validator
 *
 * This script extracts all translation keys used in the codebase and validates
 * them against the locale files to identify missing translations.
 */

const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

class TranslationValidator {
  constructor() {
    this.localeFiles = {};
    this.translationKeys = new Map();
    this.usagePatterns = [
      /t\(['"`]([^'"`]+)['"`]\)/g,
      /safeTranslate\(['"`]([^'"`]+)['"`]/g,
      /strictTranslate\(['"`]([^'"`]+)['"`]/g,
    ];
    this.loadLocaleFiles();
  }

  loadLocaleFiles() {
    const locales = ["en", "ar", "fr"];
    const localeDir = path.join(process.cwd(), "src/locales");

    for (const locale of locales) {
      try {
        const filePath = path.join(localeDir, `${locale}.json`);
        const content = fs.readFileSync(filePath, "utf-8");
        this.localeFiles[locale] = JSON.parse(content);
      } catch (error) {
        console.error(`Failed to load ${locale}.json:`, error);
        this.localeFiles[locale] = {};
      }
    }
  }

  keyExists(key, locale) {
    const keys = key.split(".");
    let obj = this.localeFiles[locale];

    for (const k of keys) {
      if (obj && typeof obj === "object" && k in obj) {
        obj = obj[k];
      } else {
        return false;
      }
    }

    return typeof obj === "string";
  }

  extractKeysFromFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const usages = [];

    lines.forEach((line, index) => {
      this.usagePatterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          usages.push({
            file: filePath,
            line: index + 1,
            key: match[1],
            context: line.trim(),
          });
        }
      });
    });

    return usages;
  }

  async scanCodebase() {
    const patterns = [
      "src/**/*.tsx",
      "src/**/*.ts",
      "!src/**/*.test.*",
      "!src/**/*.spec.*",
      "!node_modules/**",
    ];

    const files = await glob(patterns, { cwd: process.cwd() });

    for (const file of files) {
      const fullPath = path.join(process.cwd(), file);
      const usages = this.extractKeysFromFile(fullPath);

      usages.forEach((usage) => {
        if (!this.translationKeys.has(usage.key)) {
          this.translationKeys.set(usage.key, {
            key: usage.key,
            exists: {
              en: this.keyExists(usage.key, "en"),
              ar: this.keyExists(usage.key, "ar"),
              fr: this.keyExists(usage.key, "fr"),
            },
            usage: [],
          });
        }

        this.translationKeys.get(usage.key).usage.push(usage);
      });
    }
  }

  generateReport() {
    const missingKeys = Array.from(this.translationKeys.values()).filter(
      (key) => !key.exists.en || !key.exists.ar || !key.exists.fr
    );

    const unusedKeys = this.findUnusedKeys();

    console.log("\n🔍 TRANSLATION VALIDATION REPORT");
    console.log("================================\n");

    console.log(
      `📊 Total translation keys found: ${this.translationKeys.size}`
    );
    console.log(`❌ Missing translations: ${missingKeys.length}`);
    console.log(`🗑️  Unused keys: ${unusedKeys.length}\n`);

    if (missingKeys.length > 0) {
      console.log("❌ MISSING TRANSLATIONS:");
      console.log("========================\n");

      missingKeys.forEach((key) => {
        console.log(`Key: ${key.key}`);
        console.log(`  EN: ${key.exists.en ? "✅" : "❌"}`);
        console.log(`  AR: ${key.exists.ar ? "✅" : "❌"}`);
        console.log(`  FR: ${key.exists.fr ? "✅" : "❌"}`);
        console.log(`  Used in: ${key.usage.length} places`);
        console.log(`  First usage: ${key.usage[0].file}:${key.usage[0].line}`);
        console.log("");
      });
    }

    if (unusedKeys.length > 0) {
      console.log("🗑️  UNUSED KEYS:");
      console.log("================\n");
      unusedKeys.forEach((key) => console.log(`  ${key}`));
    }

    // Generate JSON report
    const report = {
      summary: {
        totalKeys: this.translationKeys.size,
        missingTranslations: missingKeys.length,
        unusedKeys: unusedKeys.length,
      },
      missingKeys: missingKeys.map((key) => ({
        key: key.key,
        exists: key.exists,
        usageCount: key.usage.length,
        files: [...new Set(key.usage.map((u) => u.file))],
      })),
      unusedKeys,
    };

    fs.writeFileSync(
      path.join(process.cwd(), "translation-report.json"),
      JSON.stringify(report, null, 2)
    );

    console.log("\n📄 Detailed report saved to: translation-report.json");
  }

  findUnusedKeys() {
    const allKeys = this.getAllKeysFromLocales();
    const usedKeys = Array.from(this.translationKeys.keys());

    return allKeys.filter((key) => !usedKeys.includes(key));
  }

  getAllKeysFromLocales() {
    const keys = [];

    const extractKeys = (obj, prefix = "") => {
      Object.keys(obj).forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === "string") {
          keys.push(fullKey);
        } else if (typeof obj[key] === "object") {
          extractKeys(obj[key], fullKey);
        }
      });
    };

    Object.values(this.localeFiles).forEach((locale) => {
      extractKeys(locale);
    });

    return [...new Set(keys)];
  }

  async validate() {
    console.log("🔍 Scanning codebase for translation usage...");
    await this.scanCodebase();
    this.generateReport();
  }
}

// Run the validator
if (require.main === module) {
  const validator = new TranslationValidator();
  validator.validate().catch(console.error);
}

module.exports = { TranslationValidator };
