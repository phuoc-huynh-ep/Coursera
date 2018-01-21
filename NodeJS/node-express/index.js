const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
http = require('http');

const app = express();
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter  = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;

app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
console.log(`Server running at http://${hostname}:${port}/`);
});