const configs = require('./siteConfigs.json');

function getSiteConfig(url) {
  const domain = new URL(url).hostname;

  const match = Object.entries(configs).find(([key]) =>
    domain.includes(key)
  );

  return match ? match[1] : null;
}

module.exports = { getSiteConfig };