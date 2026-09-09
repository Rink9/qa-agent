import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Playwright config for QA agent runs. Generic — nothing ticket-specific lives here.
 *
 * Everything environment-specific comes from qa.config.json; everything run-specific
 * comes from QA_KEY. Selecting a run:
 *
 *   QA_KEY=PROJ-123 npx playwright test                        # that ticket's whole suite
 *   QA_KEY=PROJ-123 npx playwright test TC-004                 # one case
 *   QA_KEY=PROJ-123 QA_ENV=production npx playwright test      # another environment
 *
 * Cross-browser coverage is chosen by tagging the spec, not by editing this file:
 *   test('TC-014 …', { tag: ['@webkit'] }, async ({ page }) => { … })
 * Tags: @webkit, @firefox, @mobile. Untagged specs run on chromium only.
 */

const ROOT = __dirname;
const qa = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa.config.json'), 'utf8'));

const KEY = process.env.QA_KEY?.trim();
if (!KEY) {
  throw new Error(
    'QA_KEY is not set. This config resolves testDir, evidence and results paths from the ' +
      'Jira key, so a run must name one: QA_KEY=PROJ-123 npx playwright test. ' +
      'Running without it would collect every ticket under qa-runs/ into one result set.',
  );
}

const resolveKey = (template: string) => template.replace(/\{key\}/g, KEY);
const testRoot = resolveKey(qa.automation.testRoot);
const evidenceRoot = resolveKey(qa.automation.evidenceRoot);
// The run directory the phase artifacts live in, derived so it follows testRoot if that moves.
const runRoot = path.dirname(testRoot);

if (!fs.existsSync(path.join(ROOT, testRoot))) {
  throw new Error(
    `No generated suite at ${testRoot}. Phase 5 (qa-execute) writes it; run that first, ` +
      `or check QA_KEY=${KEY} is the right ticket.`,
  );
}

// Environment: QA_ENV picks a key from qa.config.json.environments.urls.
const envName = process.env.QA_ENV?.trim() || qa.environments.default;
const baseURL = qa.environments.urls?.[envName];
if (!baseURL) {
  const configured = Object.keys(qa.environments.urls ?? {}).filter((k) => qa.environments.urls[k]);
  throw new Error(
    configured.length
      ? `Environment '${envName}' has no URL in qa.config.json.environments.urls ` +
        `(configured: ${configured.join(', ')}). Set QA_ENV to one of those, or fill that key.`
      : `No environment URLs are configured yet. Fill environments.urls['${envName}'] in ` +
        `qa.config.json with the base URL to test against — Phase 0 asks for it on the first run.`,
  );
}

// Evidence policy comes from qa.config.json.automation.capture: screenshots, video and
// traces are captured on every case, pass or fail, because a passing baseline screenshot
// is what makes the next regression obvious.
const capture = qa.automation.capture ?? {};
const on = <T extends string>(flag: unknown, value: T) => (flag ? value : ('off' as const));

// Authenticated suites point this at a storage-state file; unset means anonymous.
const storageState = process.env.QA_STORAGE_STATE?.trim() || undefined;

export default defineConfig({
  testDir: testRoot,
  outputDir: path.join(evidenceRoot, '_artifacts'),
  // Tests must pass in isolation and in any order; no shared state between specs.
  fullyParallel: true,
  forbidOnly: true,
  // No retries. A retry-until-green suite launders flake into a pass, which is the
  // one thing this pipeline must never do (guardrail 5). Failures are re-run once
  // in isolation by hand instead, and that re-run is recorded separately.
  retries: 0,
  workers: Number(process.env.QA_WORKERS) || 4,
  reporter: [
    ['json', { outputFile: path.join(runRoot, '_raw-results.json') }],
    ['list'],
  ],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    screenshot: on(capture.screenshots, 'on'),
    video: on(capture.video, 'on'),
    trace: on(capture.traces, 'on'),
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    storageState,
  },
  projects: [
    // Default engine: everything runs here.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Opt-in engines: only specs tagged for them.
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: /@webkit/ },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, grep: /@firefox/ },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
});
