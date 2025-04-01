import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

interface SecurityScanResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  recommendation: string;
}

export class SecurityScanner {
  private results: SecurityScanResult[] = [];

  async scanDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      const audit = spawn('npm', ['audit', '--json']);
      let output = '';

      audit.stdout.on('data', (data) => {
        output += data;
      });

      audit.on('close', (code) => {
        if (code === 0) {
          const auditResult = JSON.parse(output);
          this.processAuditResults(auditResult);
          resolve();
        } else {
          reject(new Error('Dependency scan failed'));
        }
      });
    });
  }

  async scanCode(): Promise<void> {
    // Run static code analysis
    const eslintResult = await this.runEslint();
    this.processEslintResults(eslintResult);

    // Run secret scanner
    const secretScanResult = await this.runSecretScanner();
    this.processSecretScanResults(secretScanResult);
  }

  private async runEslint(): Promise<any> {
    return new Promise((resolve, reject) => {
      const eslint = spawn('npx', ['eslint', '.', '-f', 'json']);
      let output = '';

      eslint.stdout.on('data', (data) => {
        output += data;
      });

      eslint.on('close', (code) => {
        if (code === 0 || code === 1) {
          resolve(JSON.parse(output));
        } else {
          reject(new Error('ESLint scan failed'));
        }
      });
    });
  }

  generateReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: {
        critical: this.results.filter(r => r.severity === 'critical').length,
        high: this.results.filter(r => r.severity === 'high').length,
        medium: this.results.filter(r => r.severity === 'medium').length,
        low: this.results.filter(r => r.severity === 'low').length,
      }
    };

    writeFileSync(
      'security-report.json',
      JSON.stringify(report, null, 2)
    );
  }
} 