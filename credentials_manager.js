function getCredentials(siteKey) {
  return {
    username: process.env[`CRED_${siteKey}_USERNAME`],
    password: process.env[`CRED_${siteKey}_PASSWORD`]
  };
}

module.exports = { getCredentials };