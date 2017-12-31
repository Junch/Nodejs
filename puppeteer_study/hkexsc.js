const puppeteer = require('puppeteer');
const scheduler = require('node-schedule');
const MongoClient = require('mongodb').MongoClient;

// https://tutorialzine.com/2017/08/automating-google-chrome-with-node-js
// https://www.santoshsrinivas.com/puppeteer-api-to-control-headless-chrome/
// https://www.valentinog.com/blog/ui-testing-jest-puppetteer/

function later(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function get_exchange_rate() {
    const browser = await puppeteer.launch(/*{headless: false}*/);

    const page = await browser.newPage();
    // page.setViewport({ // it help develop and debug
    //     width:800,
    //     height:800
    // });

    await page.goto('http://www.sse.com.cn/services/hkexsc/home/', {waitUntil: 'networkidle2'});
    await later(5000); // wait 5 seconds
    
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
    if (date == null || hkd_rate[0] == null || hkd_rate[1] == null)
        return Promise.reject('Failed to get the exchange rate.');

    return Promise.resolve({date, open, hkd_rate});
};

async function write_to_db(ex_rate) {
    client = await MongoClient.connect('mongodb://localhost:27017/test');
    let db = client.db('test');
    let items = await db.collection('hkd_rate').find().limit(1).sort({date:-1}).toArray();
    if (items.length == 0 || items[0].date < ex_rate.date) {
        console.log("date is inserted");
        await db.collection('hkd_rate').insert(ex_rate);
    }

    client.close();
}

(async() => {
    let event = scheduler.scheduleJob("*/1 * * * *", async () => {
        console.log('This runs every 1 minutes');
        const ex_rate = await get_exchange_rate();
        console.log(ex_rate);

        await write_to_db(ex_rate);
    });
})();
