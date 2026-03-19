async function login(page, config, credentials) {
  console.log("🔐 Attempting login on current page:", page.url());

  await page.waitForTimeout(2000);

  const loginVisible = await page
    .locator(config.login.usernameSelector)
    .isVisible({ timeout: 5000 })
    .catch(() => false);

  if (!loginVisible) {
    console.log("⚠️ Login form not immediately visible, waiting longer...");

    await page.waitForSelector(config.login.usernameSelector, {
      timeout: 15000
    });
  }

  if (config.cookieSelector) {
    const cookieBtn = page.locator(config.cookieSelector);
    if (await cookieBtn.isVisible().catch(() => false)) {
      console.log("🍪 Accepting cookies");
      await cookieBtn.click();
    }
  }

  console.log("✍️ Filling credentials...");

  await page.locator(config.login.usernameSelector).fill(credentials.username);
  await page.locator(config.login.passwordSelector).fill(credentials.password);

  await page.locator(config.login.submitSelector).first().click();

  await page.waitForLoadState('networkidle');

  console.log("✅ Login attempted. Current URL:", page.url());
}

module.exports = { login };