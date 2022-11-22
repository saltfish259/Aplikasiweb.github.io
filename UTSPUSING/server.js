const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const port = 4000
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const server = http.createServer(app);
const db = new sqlite3.Database('database/motor.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, function() {
    console.log('server connected')
})

router.get('/', function(req, res) {
    //read data from sqlite and send to index.ejs
    db.all('SELECT * FROM motor', function(err, rows) {
        res.render('index', { data: rows });
    });
})

router.get('/insertpage', function(req, res) {
    res.render('insert');
})

router.get('/updatepage/:id', function(req, res) {
    //create a query to get data from sqlite
    db.all('SELECT * FROM motor WHERE id = ?', [req.params.id], function(err, rows) {
        res.render('update', { data: rows });
    });
})

router.post('/insert', function(req, res) {
    //create insert query
    var sql = "INSERT INTO motor (nama_motor, merk_motor, harga_motor) VALUES (?,?,?)";
    db.run(sql, [req.body.nama_motor, req.body.merk_motor, req.body.harga_motor], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
})

router.post('/update/:id', function(req, res) {
    //create update query
    var sql = "UPDATE motor SET nama_motor = ?, merk_motor = ?, harga_motor = ? WHERE id = ?";
    db.run(sql, [req.body.nama_motor, req.body.merk_motor, req.body.harga_motor, req.params.id], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    }
    );
})

//create router for delete
router.get('/delete/:id', function(req, res) {
    //create delete query
    var sql = "DELETE FROM motor WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect('/');
    });
})