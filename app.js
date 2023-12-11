var express = require('express');
var app = express();

app.get('/', function (req, res) {   // Routing to  /
   res.send('Hello World from root '); })

app.get('/info', function (req, res) {   // Routing to  /info
    res.send('Group G06'); })

app.get('/BadA', function (req, res) {   // Routing to  /BadA
    res.send('Bad Apple'); })

app.use(function(request, response) {  // Fehlerbehandlung
response.status(404).send("Seite nicht gefunden!");
});

var port = process.env.PORT || 8081;
var server = app.listen(port, function () {
    var host = server.address().address;
    console.log("Example app listening at http://%s:%s", host, port);
});

