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
    const chart_date = await page.$eval('#chartDate', el => el.textContent);
    let date;
    let re = /\d{4}-\d{2}-\d{2}/;
    let matches = chart_date.match(re);
    if (matches) {
        date = new Date(matches[0]);
    }
    const chart_hkexsc_open = await page.$eval('#chartId1', el => el.textContent);
    let open = (chart_hkexsc_open == '是');
    const hkd_rate = await page.$$eval('#hgt_hzjs h4', els => els.map(el => parseFloat(el.textContent)));

    browser.close();
    return Promise.resolve({date, open, hkd_rate});
};

(async() => {
    const res = await get_exchange_rate();
    console.log(res);
})();
