const request = require('request');
//const cheerio = require('cheerio');

// https://coderwall.com/p/9cifuw/scraping-web-pages-using-node-js-using-request-promise
// https://thecodingstuff.com/nodejs-simple-web-scraper-using-cheerio/

function requestp(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (err, res, body) {
            if (err) {
                return reject(err);
            } else if (res.statusCode !== 200) {
                err = new Error("Unexpected status code: " + res.statusCode);
                err.res = res;
                return reject(err);
            }
            resolve(body);
        });
    });
}


(async () => {
	let url = 'http://www.sse.com.cn/services/hkexsc/home/';
	let data = await requestp(url);
	let re_date = /var VALID_DATE = '(.+)'/;
	let re_buy = /var BUY_PRICE = '(.+)'/;
	let re_sell = /var SELL_PRICE = '(.+)'/;
	let lines = data.split('\n');
	let date, buy_price, sell_price;
	lines.forEach(line => {
		let ret = line.match(re_date);
		if (ret) {
			date = new Date(ret[1]);
		}

		ret = line.match(re_buy);
		if (ret) {
			buy_price = parseFloat(ret[1]);
		}

		ret = line.match(re_sell);
		if (ret) {
			sell_price = parseFloat(ret[1]);
		}
	});

	console.log({date, buy_price, sell_price});
	//const $ = cheerio.load(html);

	//let chartDate = $('#chartDate').textContent;
	//console.log(chartDate);
})();