const puppeteer = require('puppeteer');

// https://tutorialzine.com/2017/08/automating-google-chrome-with-node-js
// https://www.santoshsrinivas.com/puppeteer-api-to-control-headless-chrome/

(async () => {
	const browser = await puppeteer.launch({
		headless: false
	});

	const page = await browser.newPage();

	await page.goto('https://tutorialzine.com');
	await page.click('.search-trigger');
	await page.focus('#search-form-top input');
	await page.type('#search-form-top input', 'Javascript', {delay: 200});
	await page.keyboard.press('Enter');

	// Wait for the results to show up
	await page.waitForSelector('#articles div h4'); //*[@id="articles"]/ul/li[1]/a/div[2]/div/h4

	// Extract the results from the page
	const titles = await page.evaluate(()=>{
		const articles = Array.from(document.querySelectorAll('#articles div h4'));
		return articles.map(article => article.textContent);
	});
	console.log(titles.join('\n'));

	// Keep the browser open.
	// browser.close();
})();