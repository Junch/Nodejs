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
var app = express();

if(process.env.NODE_ENV !== 'production') {
  require('../webpackdev.server')(app)
}

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 8081));

app.use('/', express.static(path.join(__dirname, '../static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var stocks = [
  {
    symbol: 'SZ000002',
    title: '万科A',
    price: 24.43,
    volume: 7000
  },
  {
    symbol: 'SH601318',
    title: '中国平安',
    price: 36.00,
    volume: 3800
  },
  {
    symbol: 'SH600875',
    title: '东方电气',
    price: 13.63,
    volume: 1400
  },
  {
    symbol: 'SH600030',
    title: '中信证券',
    price: 19.35,
    volume: 2100
  },
  {
    symbol: 'SH510880',
    title: '红利ETF',
    price: 2.853,
    volume: 5000
  },
  {
    symbol: 'SH510650',
    title: '金融行业',
    price: 1.549,
    volume: 23000
  }];

app.get('/api/stocks', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(stocks);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
