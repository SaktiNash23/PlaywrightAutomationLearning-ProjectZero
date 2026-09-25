// @ts-check
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  testMatch: 'webAPIPart1.spec.js',
  timeout: 50 * 1000,
  expect:{timeout: 5*1000}, 
  reporter: 'html',
  use: 
  {
    //Chrome = "chromium"
    //Safari = "webkit"
    //Firefox = "firefox"
    browserName: "chromium",
    headless: false,
    trace: 'retain-on-failure', //Generates trace logs. "on" generates trace logs regardless of Pass or Fail. "retain-on-failure" generates trace logs only on test Fail
    screenshot: "on", //Captures screenshot for every step
  },

});

