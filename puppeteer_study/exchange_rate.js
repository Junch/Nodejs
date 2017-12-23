const puppeteer = require('puppeteer');

// https://tutorialzine.com/2017/08/automating-google-chrome-with-node-js
// https://www.santoshsrinivas.com/puppeteer-api-to-control-headless-chrome/
// https://www.valentinog.com/blog/ui-testing-jest-puppetteer/

(async () => {
    const browser = await puppeteer.launch(/*{headless: false}*/);

    const page = await browser.newPage();
    // page.setViewport({ // it help develop and debug
    //     width:800,
    //     height:800
    // });

    await page.goto('http://www.sse.com.cn/services/hkexsc/currency/', {waitUntil: 'networkidle2'});
    await page.evaluate(()=>{
        var inputDate = document.querySelectorAll('.sse_conyear_date input')[1];
        inputDate.removeAttribute('readonly');
        inputDate.value = "2017-12-12";
        //var btn = document.querySelectorAll('.sse_con_query button')[1];
        //btn.click();
    });

    // The 2 commented lines above do the same work as 2 lines below
    const btns = await page.$$('.sse_con_query button');
    await btns[1].click();

    await page.waitForSelector('.search_table2 div'); // This line cannot be ignored

    const rates = await page.$$eval('table.search_table2 div', divs => {
        return divs.map(div => parseFloat(div.textContent));  // The text should be read from the context of the page.
    });

    browser.close();

    const rate = ((rates[0] + rates[1])/2.0).toFixed(4);
    console.log(`Currency rate is ${rate}`);
})();