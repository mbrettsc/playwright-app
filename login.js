// login.js
async function login(page, config, credentials) {
  console.log("🔐 Attempting login on current page:", page.url());

  await page.waitForTimeout(2000);

  if (config.cookieSelector) {
    const cookieBtn = page.locator(config.cookieSelector);
    if (await cookieBtn.isVisible().catch(() => false)) {
      console.log("🍪 Accepting cookies");
      await cookieBtn.click();
    }
  }

  // ✅ Multi-step login
  if (config.login.steps) {
    for (const step of config.login.steps) {
      const input = config.shadowDom
        ? page.getByPlaceholder(step.placeholder)
        : page.locator(step.fillSelector);

      console.log(`⏳ Waiting for ${step.fillSelector || step.placeholder}...`);
      await input.waitFor({ state: 'visible', timeout: 15000 });

      console.log(`✍️ Filling ${step.credential}...`);
      await input.fill(credentials[step.credential]);

      const submitBtn = config.shadowDom
        ? page.getByRole('button', { name: step.submitLabel || 'Login' })
        : page.locator(step.submitSelector).first();

      await submitBtn.click();
      await page.waitForLoadState('networkidle');
    }

  // ✅ Legacy single-step login (existing sites keep working)
  } else {
    const usernameInput = config.shadowDom
      ? page.getByPlaceholder(config.login.usernamePlaceholder)
      : page.locator(config.login.usernameSelector);

    const passwordInput = config.shadowDom
      ? page.getByPlaceholder(config.login.passwordPlaceholder)
      : page.locator(config.login.passwordSelector);

    await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    await usernameInput.fill(credentials.username);
    await passwordInput.fill(credentials.password);

    if (config.shadowDom) {
      await page.getByRole('button', { name: 'Login' }).click();
    } else {
      await page.locator(config.login.submitSelector).first().click();
    }

    await page.waitForLoadState('networkidle');
  }

  // ✅ Extra post-login steps (e.g. navigate to overzicht)
  if (config.postLogin.extraSteps) {
    for (const step of config.postLogin.extraSteps) {
      console.log(`➡️ Extra step: clicking ${step.clickSelector}`);
      await page.locator(step.clickSelector).first().waitFor({ state: 'visible', timeout: 10000 });
      await page.locator(step.clickSelector).first().click();
      if (step.waitFor === 'networkidle') {
        await page.waitForLoadState('networkidle');
      }
    }
  }

  console.log("✅ Login complete. Current URL:", page.url());
}

module.exports = { login };