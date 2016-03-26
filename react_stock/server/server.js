/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var stock = require('./routes/stock.js');
var trade = require('./routes/trade.js');
var account = require('./routes/account.js')
var markets =  require('./routes/markets.js');
var app = express();

if(process.env.NODE_ENV !== 'production') {
  require('../webpackdev.server')(app)
}

var Promise = require('bluebird');
var MongoClient = require('mongodb');
var db;

app.use(function (req, res, next) {
  if (db == null){
    MongoClient.connect('mongodb://localhost:27017/stockdb', {promiseLibrary: Promise}).then((res) => {
      db = res;
      req.db = db;
      next();
    });
  } else {
    req.db = db;
    next();
  }
});

app.set('port', (process.env.PORT || 8081));

app.use('/', express.static(path.join(__dirname, '../static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/stock', stock);
app.use('/api/trade', trade);
app.use('/api/cash', account);
app.use('/api/markets', markets);

var server = app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = server;
