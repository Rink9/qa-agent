import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for QA agent runs.
 * Owned by Phase 5 (qa-execute) — generated, not hand-maintained.
 *
 * Evidence policy comes from qa.config.json.automation.capture: screenshots, video,
 * traces and console errors are captured on every case, pass or fail, because a passing
 * baseline screenshot is what makes the next regression obvious.
 */
export default defineConfig({
  testDir: './qa-runs/TKSD-17312/05-execution/tests',
  outputDir: './qa-runs/TKSD-17312/05-execution/evidence/_artifacts',
  // Tests must pass in isolation and in any order; no shared state between specs.
  fullyParallel: true,
  forbidOnly: true,
  // No retries. A retry-until-green suite launders flake into a pass, which is the
  // one thing this pipeline must never do (guardrail 5). Failures are re-run once
  // in isolation by hand instead, and that re-run is recorded separately.
  retries: 0,
  workers: 4,
  reporter: [['json', { outputFile: './qa-runs/TKSD-17312/05-execution/_raw-results.json' }], ['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'https://conferencebdev.wpenginepowered.com',
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // Anonymous public reader: no stored auth state anywhere in this suite.
    storageState: undefined,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
