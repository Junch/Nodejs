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


var users = [
  {
    firstName: 'Mark',
    lastName: 'Otto',
    userName: '@mdo'
  },
  {
    firstName: 'Jacob',
    lastName: 'Thornton',
    userName: '@fat'
  },
  {
    firstName: 'Larry the Bird',
    lastName: 'Hello',
    userName: '@twitter'
  }];

app.get('/api/users', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(users);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
