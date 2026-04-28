const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('API ERROR:', response.url(), response.status());
    }
  });

  await page.goto('http://localhost:3000/#/');
  console.log('Navigated to home page.');
  
  await page.waitForTimeout(2000);
  
  console.log('Clicking on Sign In link...');
  const links = await page.$$('a');
  let clicked = false;
  for (const link of links) {
    const text = await page.evaluate(el => el.textContent, link);
    if (text.includes('دخول') || text.includes('Sign In')) {
      console.log('Found link text:', text);
      await link.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    console.log('Could not find login link.');
  } else {
    await page.waitForTimeout(2000);
    console.log('Current URL:', page.url());
  }

  await browser.close();
})();
