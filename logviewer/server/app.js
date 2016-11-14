let path = require('path');
let express = require('express');
let compression = require('compression');
let morgan = require('morgan');
let logger = require('./logger');

let app = express();
app.use(compression());
logger.debug('Overriding \'Express\' logger');
app.use(morgan('combined', {stream: logger.stream}));
app.use('/', express.static(path.join(__dirname, '../public')));

let port = process.env.PORT || 9090;
app.listen(port, '0.0.0.0', function(){
    console.log('==> 🌎 app listening at http://0.0.0.0:%s', port);
});
