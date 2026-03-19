const scrape = require('./scrape');

(async () => {
  try {
    const result = await scrape(
      'https://u21804356.ct.sendgrid.net/ls/click?upn=u001.-2FzRRbkZ-2FrNiJght-2FX-2Ba1s-2FW6H-2FxoDLKx2KQZGc4QHgf-2BCSiyxVNa1Os2abQfaYwe1BjOvKVyHeLXH-2FBjCNPb-2BUFp-2FCQ9HB6H9fVOBZH9UR4-3DKd4p_e2U2v4Bn-2FEXV77uRiQnwigAitltuzWt8XyfJ7xyRnOwxYNPV9bZhnZamPyEujPr0QN9Az0LdhCkJzHi8odskWpTFJSPd5CW-2B2H3dcWdrfffMuGKRb5dqFOqXTZPmmnHHjHgi5yC7B2fCSpCQA6zTEz9pdCvlc05M0at-2Bovgyyc-2FgnWHre7fZNB2Mlg2yJHJA5r0DzCg7BlSVTWg7aEJfNQ-3D-3D',
      { username: "tenders@kodros.nl", password: "Rotterdam20we?" }
    );
    console.log(result);
  } catch (err) {
    console.error('Scrape failed:', err.message);
    process.exit(1);
  }
})();