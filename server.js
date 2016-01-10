var express = require('express');
var fortune = require('fortune');
var nedbAdapter = require('fortune-nedb');
var jsonapi = require('fortune-json-api');


// Új tároló (alapértelmezetten memóriában tárol)
// Beállítjuk a JSON API serializer-t
var store = fortune({
    adapter: {
        type: nedbAdapter,
        options: { dbPath: __dirname + '/.db' }  // .db könyvtárba tárolja a dolgokat
    },
    serializers: [{ type: jsonapi }]
});

store.defineType('teacher', {
        firstname: {type: String},
        lastname: {type: String},
        phonenumber: {type: String},
        emailaddress: {type: String},
});


store.defineType('subject', {
    name: {type: String},
    description: {type: String},
    credit: {type: String},
    teacherid: {type: String},
});

var server = express();

/*server.get('/people', function (req, res) {
    res.json([
        {
            id: 1,
            name: 'alma'
        },
        {
            id: 2,
            name: 'korte'
        },
    ]);
})*/


// Express middleware
// Minden URL-ről engedélyezzük a hozzáférést az API-hoz
// Mindenképp a `server.use(fortune.net.http(store));` sor elé kerüljön
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
server.use(fortune.net.http(store));

var port = process.env.PORT || 8080;
// Csak akkor fusson a szerver, ha sikerült csatlakozni a tárolóhoz
// Hasonlóan a Waterline-hoz    
store.connect().then(function () {
    server.listen(port, function () {
        console.log('JSON Api server started on port ' + port);
    });
});