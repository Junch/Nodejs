const hkexsc = require('./hkexsc.js');

(async() => {
    try {
        let rate = await hkexsc.get_exchange_rate_fast();
        console.log(rate);
        rate = await hkexsc.get_exchange_rate();
        console.log(rate);
    }catch(err){
        console.error(err);
    }
})();
