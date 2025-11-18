const express = require('express');
const router = express.Router();
const { query } = require('../utils/database');
const logger = require('../utils/logger');
var SHA1 = require("crypto-js/sha1");
const { error } = require('winston');
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, './uploads')
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix+ext);

    }
})

const upload = multer({ storage: storage}) /*A második storage (érték) az a felette definiált változó nevével mindig meg kell egyezni. */

// SELECT ALL records fron :table
router.get('/:table', (req, res) => {
    const table = req.params.table;
    query(`SELECT * FROM ${table}`, [], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

// SELECT ONE record from :table by :id
router.get('/:table/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    query(`SELECT * FROM ${table} WHERE id=?`, [id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

// SELECT records FROM :table by :field
router.get('/:table/:field/:op/:value', (req, res) => {
    let table = req.params.table;
    let field = req.params.field;
    let op = getOp(req.params.op);
    let value = req.params.value;

    if (req.params.op == 'lk') {
        value = `%${value}%`;
    }

    query(`SELECT * FROM ${table} WHERE ${field}${op}?`, [value], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);

});

/* File upload */
router.post('/upload',upload.single('image'),(req,res)=>{
    if(!req.file){
        res.status(400).send({error:'Nincs feltöltött fájl!'});
        return;
    }
    res.status(200).json({message:'Fájl feltöltve sikeresen!',filename:req.file.filename, path: '/uploads/'});


});

router.delete('/image/:filename',(req,res)=>{{
    const filename = req.params.filename;
    const filepath = path.join(__dirname,'..','uploads',filename);
    fs.unlink(filepath,(err)=>{
        if(err){
            logger.error(`Hiba a fájl törlése során: ${err.message}`);
            res.status(500).send({error:'Hiba a fájl törlése során!'});
            return;
        }
        return res.status(200).send({message:'Fájl sikeresen törölve!'});
    });
}})
router.post('/:table/login', (req, res) => {
    let { email, password } = req.body;
    let table = req.params.table;

    if (!email || !password) {
        res.status(400).send({ error: 'Hiányzó adatok!' });
        return;
    }

    query(`SELECT * FROM ${table} WHERE email=? AND password=?`, [email, SHA1(password).toString()], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.length == 0) {
            res.status(400).send({ error: 'Hibás belépési adatok!' });
            return;
        }
        if (!results[0].status) {
            res.status(400).send({ error: 'A felhasználó le van tiltva!' });
            return;
        }
        res.status(200).json(results);
    }, req);

});

// Registation
router.post('/:table/registration', (req, res) => {
    let table = req.params.table;
    let { name, email, password, confirm, phone, address } = req.body;

    if (!name || !email || !password || !confirm) {
        res.status(400).send({ error: 'Hiányzó adatok!' });
        return;
    }

    if (password != confirm) {
        res.status(400).send({ error: 'A megadott jelszavak nem egeznek!' });
        return;
    }

    if (!password.match(passwdRegExp)) {
        res.status(400).send({ error: 'A megadott jelszó nem elég biztonságos!' });
        return;
    }

    query(`SELECT id FROM ${table} WHERE email=?`, [email], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        if (results.length != 0) {
            res.status(400).send({ error: 'A megadott e-mail cím már regisztrálva van!' });
            return;
        }

        query(`INSERT INTO ${table} (name, email, password, role, phone, address) VALUES(?,?,?,'user',?,?)`, [name, email, SHA1(password).toString(), phone, address], (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            res.status(200).json(results);
        }, req);

    }, req);

});

// ADD NEW record to :table
router.post('/:table', (req, res) => {
    let table = req.params.table;
    let fields = Object.keys(req.body).join(',');
    let values = "'" + Object.values(req.body).join("', '") + "'";
    query(`INSERT INTO ${table} (${fields}) VALUES(${values})`, [], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

// UPDATE records in :table by :id
router.patch('/:table/:id', (req, res) => {
    let table = req.params.table;
    let id = req.params.id;
    let fields = Object.keys(req.body);
    let values = Object.values(req.body);
    let updates = [];
    for (let i = 0; i < fields.length; i++) {
        updates.push(`${fields[i]}='${values[i]}'`);
    }
    let str = updates.join(',');
    query(`UPDATE ${table} SET ${str} WHERE id=?`, [id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

// DELETE ONE record fron :table by :id
router.delete('/:table/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    query(`DELETE FROM ${table} WHERE id=?`, [id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

// DELETE ALL record fron :table 
router.delete('/:table', (req, res) => {
    const table = req.params.table;
    query(`DELETE FROM ${table}`, [], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(results);
    }, req);
});

/*   ___ ___ ___  _____    ___ _   _  ___  _____   _____  ___   __
 / __| __/ __|/_/   \  | __(_) (_)/ __|/ __\ \ / /_/ \| \ \ / /
 \__ \ _| (_ | -< |) | | _|| |_| | (_ | (_ |\ V / -< .` |\ V / 
 |___/___\___|__<___/  |_|  \___/ \___|\___| \_/|__<_|\_| |_|  
                                                                  
                                                                                            
                                                                                            */

function getOp(op) {
    switch (op) {
        case 'eq': { op = '='; break; }
        case 'lt': { op = '<'; break; }
        case 'lte': { op = '<='; break; }
        case 'gt': { op = '>'; break; }
        case 'gte': { op = '>='; break; }
        case 'not': { op = '<>'; break; }
        case 'lk': { op = ' like '; break; }
    }
    return op;
}

module.exports = router;


