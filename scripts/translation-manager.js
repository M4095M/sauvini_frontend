const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Translation Management CLI Tool
 *
 * Provides commands for managing translations across the application
 */

class TranslationManager {
  constructor() {
    this.projectRoot = process.cwd();
  }

  /**
   * Extract all translation keys from the codebase
   */
  extractKeys() {
    console.log("🔍 Extracting translation keys...");

    try {
      // Run the translation validator
      execSync("node scripts/translation-validator.js", {
        stdio: "inherit",
        cwd: this.projectRoot,
      });

      console.log("✅ Translation keys extracted successfully!");
    } catch (error) {
      console.error("❌ Failed to extract translation keys:", error);
    }
  }

  /**
   * Generate missing translation keys for all locales
   */
  generateMissingKeys() {
    console.log("🔧 Generating missing translation keys...");

    try {
      const reportPath = path.join(this.projectRoot, "translation-report.json");

      if (!fs.existsSync(reportPath)) {
        console.log("📊 Running translation validation first...");
        this.extractKeys();
      }

      const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      const missingKeys = report.missingKeys || [];

      if (missingKeys.length === 0) {
        console.log("✅ No missing translation keys found!");
        return;
      }

      console.log(`📝 Found ${missingKeys.length} missing translation keys`);

      // Generate template for missing keys
      const template = this.generateTranslationTemplate(missingKeys);

      fs.writeFileSync(
        path.join(this.projectRoot, "missing-translations-template.json"),
        JSON.stringify(template, null, 2)
      );

      console.log(
        "📄 Missing keys template saved to: missing-translations-template.json"
      );
      console.log(
        "💡 Please translate the missing keys and add them to the respective locale files"
      );
    } catch (error) {
      console.error("❌ Failed to generate missing keys:", error);
    }
  }

  /**
   * Generate a template for missing translation keys
   */
  generateTranslationTemplate(missingKeys) {
    const template = {
      en: {},
      ar: {},
      fr: {},
    };

    missingKeys.forEach(({ key, exists }) => {
      const keys = key.split(".");
      let current = template.en;

      // Create nested structure
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      // Add placeholder for the final key
      const finalKey = keys[keys.length - 1];
      current[finalKey] = `[TRANSLATE] ${key}`;
    });

    return template;
  }

  /**
   * Validate translation files
   */
  validateFiles() {
    console.log("🔍 Validating translation files...");

    const locales = ["en", "ar", "fr"];
    const localeDir = path.join(this.projectRoot, "src/locales");

    let allValid = true;

    locales.forEach((locale) => {
      const filePath = path.join(localeDir, `${locale}.json`);

      try {
        const content = fs.readFileSync(filePath, "utf-8");
        JSON.parse(content);
        console.log(`✅ ${locale}.json is valid`);
      } catch (error) {
        console.error(`❌ ${locale}.json is invalid:`, error);
        allValid = false;
      }
    });

    if (allValid) {
      console.log("✅ All translation files are valid!");
    } else {
      console.log("❌ Some translation files have issues");
    }
  }

  /**
   * Get translation statistics
   */
  getStats() {
    const reportPath = path.join(this.projectRoot, "translation-report.json");

    if (!fs.existsSync(reportPath)) {
      console.log("📊 Running translation validation first...");
      this.extractKeys();
    }

    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

    return {
      totalKeys: report.summary.totalKeys,
      missingKeys: report.summary.missingTranslations,
      unusedKeys: report.summary.unusedKeys,
      coverage: {
        en: 100, // Will be calculated based on missing keys
        ar: 100,
        fr: 100,
      },
    };
  }

  /**
   * Create a translation coverage report
   */
  generateCoverageReport() {
    console.log("📊 Generating translation coverage report...");

    const stats = this.getStats();
    const coverage = {
      total: stats.totalKeys,
      missing: stats.missingKeys,
      unused: stats.unusedKeys,
      coverage: Math.round(
        ((stats.totalKeys - stats.missingKeys) / stats.totalKeys) * 100
      ),
    };

    console.log("\n📈 TRANSLATION COVERAGE REPORT");
    console.log("==============================");
    console.log(`Total Keys: ${coverage.total}`);
    console.log(`Missing Keys: ${coverage.missing}`);
    console.log(`Unused Keys: ${coverage.unused}`);
    console.log(`Coverage: ${coverage.coverage}%`);

    if (coverage.coverage < 90) {
      console.log("⚠️  Translation coverage is below 90%");
    } else {
      console.log("✅ Translation coverage is good!");
    }
  }
}

// CLI Interface
const command = process.argv[2];
const manager = new TranslationManager();

switch (command) {
  case "extract":
    manager.extractKeys();
    break;
  case "generate":
    manager.generateMissingKeys();
    break;
  case "validate":
    manager.validateFiles();
    break;
  case "stats":
    manager.generateCoverageReport();
    break;
  case "all":
    console.log("🚀 Running full translation validation...\n");
    manager.validateFiles();
    console.log("");
    manager.extractKeys();
    console.log("");
    manager.generateCoverageReport();
    break;
  default:
    console.log("🔧 Translation Management CLI");
    console.log("==============================");
    console.log("");
    console.log("Available commands:");
    console.log("  extract   - Extract all translation keys from codebase");
    console.log("  generate  - Generate missing translation keys template");
    console.log("  validate  - Validate translation files");
    console.log("  stats     - Show translation coverage statistics");
    console.log("  all       - Run all validation steps");
    console.log("");
    console.log("Usage: npm run translation <command>");
    break;
}

module.exports = { TranslationManager };
