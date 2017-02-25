var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {

	res.render('index');

});

app.listen(port);