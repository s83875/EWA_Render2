var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Define prices and weights
const SELF_PHP_PRICE = 25.4;
const SELF_PHP_WEIGHT = 800;
const PHP_REF_PRICE = 18;
const PHP_REF_WEIGHT = 600;
const PHP_COOKBOOK_PRICE = 39;
const PHP_COOKBOOK_WEIGHT = 1300;

const VAT_RATE = 0.05; // VAT rate 5%
const FREE_SHIPPING_THRESHOLD = 100; // Free shipping over 100€
const SHIPPING_COST = 5.99; // Shipping cost for packages up to 20kg

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));
app.get('/bestellg0.html', function (req, res) {
   res.sendFile(__dirname + "/" + "bestellg0.html");
});

app.post('/calculate', urlencodedParser, function (req, res) {
    var SELF_PHP_AMOUNT = parseInt(req.body.self_php);
    var PHP_REF_AMOUNT = parseInt(req.body.php_referenz);
    var PHP_COOKBOOK_AMOUNT = parseInt(req.body.php_kochbuch);

    var errors = [];
    var subtotal = 0;
    var totalWeight = 0;

    // Calculate subtotal and total weight
    if (SELF_PHP_AMOUNT >= 0 && PHP_REF_AMOUNT >= 0 && PHP_COOKBOOK_AMOUNT >= 0) {
        subtotal += SELF_PHP_AMOUNT * SELF_PHP_PRICE + PHP_REF_AMOUNT * PHP_REF_PRICE + PHP_COOKBOOK_AMOUNT * PHP_COOKBOOK_PRICE;
        totalWeight += SELF_PHP_AMOUNT * SELF_PHP_WEIGHT + PHP_REF_AMOUNT * PHP_REF_WEIGHT + PHP_COOKBOOK_AMOUNT * PHP_COOKBOOK_WEIGHT;
    } else {
        if (SELF_PHP_AMOUNT < 0) errors.push("Die Menge darf nicht negativ sein: self_php");
        if (PHP_REF_AMOUNT < 0) errors.push("Die Menge darf nicht negativ sein: php_referenz");
        if (PHP_COOKBOOK_AMOUNT < 0) errors.push("Die Menge darf nicht negativ sein: php_kochbuch");
    }

    // Calculate VAT, shipping cost, and total price
    var vat = subtotal * VAT_RATE;
    var shippingCost = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    var totalPrice = subtotal + vat + shippingCost;

    // Prepare output
    var responseHtml = errors.map(error => `<p style='color: red;'>${error}</p>`).join('');
    responseHtml += `<p>Zwischensumme: ${subtotal.toFixed(2)} €</p>
                     <p>Mehrwertsteuer: ${vat.toFixed(2)} €</p>
                     <p>Versandkosten: ${shippingCost.toFixed(2)} €</p>
                     <p>Gesamtpreis: ${totalPrice.toFixed(2)} €</p>
                     <p>Gesamtgewicht: ${totalWeight} g</p>`;

    res.send(responseHtml);
});

app.use(function (request, response) {
    response.status(404).send("Seite nicht gefunden!");
});

var port = process.env.PORT || 8081;
var server = app.listen(port, function () {
    var host = server.address().address;
    console.log("Example app listening at http://%s:%s", host, port);
});
