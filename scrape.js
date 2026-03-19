const { chromium } = require('playwright');
const { getSiteConfig } = require('./config_resolver');
const { getCredentials } = require('./credentials_manager');
const { login } = require('./login');

async function scrape(url) {
  console.log("Incoming URL:", url);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ✅ STEP 1: open original URL (redirect happens here)
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForLoadState('networkidle');

    const resolvedUrl = page.url();
    console.log("Resolved URL:", resolvedUrl);

    // ✅ STEP 2: get config AFTER redirect
    const config = getSiteConfig(resolvedUrl);

    if (!config) {
      throw new Error(`Unsupported site: ${resolvedUrl}`);
    }

    const credentials = getCredentials(config.key);

    if (!credentials.username || !credentials.password) {
      throw new Error(`Missing credentials for ${config.key}`);
    }

    // ✅ STEP 3: LOGIN ON CURRENT PAGE (NO NAVIGATION)
    await login(page, config, credentials);


    // ✅ STEP 4: wait for post-login content
    await page.waitForSelector(config.postLogin.successSelector, {
      timeout: 10000
    });

    const html = await page.content();

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