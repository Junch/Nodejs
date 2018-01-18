'use strict'

const puppeteer = require('puppeteer');
const glob = require('glob');

function fileExists(pattern){
    return new Promise((resolve, reject)=>{
        glob(pattern, function(err, files){
            if (err) {
                return reject(err);
            }

            return resolve(files);
         });
    });
};

async function get_cw_data(symbol) {
    const browser = await puppeteer.launch(/*{headless: false}*/);

    const page = await browser.newPage();
    page.setViewport({ // it help develop and debug
        width:1200,
        height:800
    });

    await page.goto('http://www.cninfo.com.cn/cninfo-new/index', {waitUntil: 'networkidle2'});
    await page.waitFor(1000); // wait 1 seconds

    //const e = (await page.$x('//*[@id="index_cw_input_obj"]'))[0];
    //await e.focus();
    //await page.keyboard.type('601318');
    await page.type('#index_cw_input_obj', symbol);
    console.log(`Input the symbol of the stock: ${symbol}`);

    // const linkHandler = (await page.$x('//*[@id="index_cw_stock_list"]/li[2]/a'))[0];
    // await linkHandler.click();
    await page.click('#index_cw_stock_list > li:nth-child(2) > a');
    console.log('Select the stock from the list');

    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: './'
    });

    await page.click('#con-f-2 > div > div.down_button_row > button');
    console.log('Begin to download');

    let nCount = 60; // 60 seconds
    while(nCount > 0){
        let files = await fileExists(`./*${symbol}*.zip`);
        if (files.length == 0) {
            await page.waitFor(1000); // 1 second
            --nCount;
        }else {
            break;
        }
    }

    console.log(nCount > 0? `Downloaded successfully within ${60-nCount} seconds`: 'Downloaded timeout');

    browser.close();
};

(async() => {
    await get_cw_data('601318');
})();
