var soap = require("soap");
var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';

reqURL = soap.createClient(url, function(err, client){
    if (err){
        console.log(err);
        return;
    }

    client.StockQuote.StockQuoteSoap.GetQuote({symbol:'NKE'}, function(err, response){
            if (err){
                console.log(err);
                return;
            }
            
            console.log(response);
    });
});
