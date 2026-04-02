import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, // iPhone 14 Pro dimensions
  deviceScaleFactor: 3,
});
const page = await context.newPage();

// Go to portal dashboard
await page.goto('http://localhost:3000/portal', { waitUntil: 'networkidle' });

// Wait a bit for animations
await page.waitForTimeout(1000);

// Take screenshot
await page.screenshot({
  path: './public/images/portal-screenshot.png',
  fullPage: false
});

console.log('Screenshot saved to public/images/portal-screenshot.png');

await browser.close();
