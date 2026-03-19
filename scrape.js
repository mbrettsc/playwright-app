const { chromium } = require('playwright');
const { getSiteConfig } = require('./config_resolver');
const { getCredentials } = require('./credentials_manager');
const { login } = require('./login');

async function scrape(url) {
  console.log("Incoming URL:", url);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForLoadState('networkidle', { timeout: 30000 });

    const resolvedUrl = page.url();
    console.log("Resolved URL:", resolvedUrl);

    const config = getSiteConfig(resolvedUrl);

    if (!config) {
      throw new Error(`Unsupported site: ${resolvedUrl}`);
    }
    const credentials = getCredentials(config.key);
    console.log(`Using credentials for ${credentials.username}:`);

    if (!credentials.username || !credentials.password) {
      throw new Error(`Missing credentials for ${config.key}`);
    }

    await login(page, config, credentials);

    await page.waitForSelector(config.postLogin.successSelector, {
      timeout: 30000  // increase from 10000
    });

    const html = await page.content();
    await page.waitForTimeout(50000);
    console.log("✅ Scraping successful");

    return {
      originalUrl: url,
      resolvedUrl,
      finalUrl: page.url(),
      html
    };

  } catch (err) {
    console.error("❌ Scrape error:", err.message);

    await page.screenshot({ path: 'error.png' });

    throw err;

  } finally {
    await browser.close();
  }
}

module.exports = scrape;