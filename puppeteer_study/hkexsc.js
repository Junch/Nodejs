const puppeteer = require('puppeteer');
const moment = require('moment');

// https://tutorialzine.com/2017/08/automating-google-chrome-with-node-js
// https://www.santoshsrinivas.com/puppeteer-api-to-control-headless-chrome/
// https://www.valentinog.com/blog/ui-testing-jest-puppetteer/

async function get_exchange_rate() {
    const browser = await puppeteer.launch(/*{headless: false}*/);

    const page = await browser.newPage();
    // page.setViewport({ // it help develop and debug
    //     width:800,
    //     height:800
    // });

    await page.goto('http://www.sse.com.cn/services/hkexsc/home/', {waitUntil: 'networkidle2'});
    const chartDate = await page.$eval('#chartDate', el => el.textContent);
    console.log(chartDate);
    const hkexsc_open = await page.$eval('#chartId1', el => el.textContent);
    console.log(hkexsc_open);
    const hk_rate = await page.$$eval('#hgt_hzjs h4', els => els.map(el => parseFloat(el.textContent)));
    console.log(hk_rate);

    browser.close();
    return Promise.resolve(chartDate);
};

(async() => {
	await get_exchange_rate();
})();
