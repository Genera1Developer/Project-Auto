FILE PATH: api/proxy.js
CONTENT: 
```javascript
const puppeteer = require('puppeteer');

const getHtml = async (url, options = {}) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, options);
  const html = await page.content();

  await browser.close();
  return html;
};

module.exports = {
  getHtml,
};
```