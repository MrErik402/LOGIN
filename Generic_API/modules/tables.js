const express = require("express");
const router = express.Router();
const { query } = require("../utils/database");
const logger = require("../utils/logger")
const SHA1 = require("crypto-js/sha1")
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


// Select ALL RECORD FROM TABLE
router.get("/:table", (req, res) => {
  const table = req.params.table;
  query(`SELECT * FROM ${table}`, [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//SELECT ONE RECORD BY ID FROM TALBE
router.get("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//SELECT records FROM :table by :field
router.get('/:table/:field/:operator/:value', (req,res)=>{
  const table = req.params.table;
  const field = req.params.field;
  const operator = getOp(req.params.operator);
  const value = req.params.value

  if(req.params.op == "lk"){
    value = `%${value}%`
  }
  query(`SELECT * FROM ${table} WHERE ${field}${operator}?`, [value], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//LOGIN method
router.post('/:table/login', (req, res) => {
  const { email, password } = req.body;
  const table = req.params.table;

  if (!email || !password) {
    res.status(400).send({ error: 'HIBA! Nem adtál meg minden adatot!' });
    return;
  }

  query(`SELECT * FROM ${table} WHERE email = ? AND password = ? `, [email, SHA1(password).toString()], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (res.length == 0) return res.status(400).json({ error: "HIBA! Hibás belépési adatok fijú." })
    logger.verbose(`[GET /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//REGISTER method
router.post('/:table/registration', (req, res) => {
  const table = req.params.table;
  const { name, email, password, confirm } = req.body
  if (!name || !email || !password || !confirm) return res.status(400).json({ error: "HIBA! Nem adtál meg minden adatot te fijú!" });
  if (password != confirm) return res.status(400).json({ error: "HIBA! Nem egyezik az általad megadott két jelszó!" });
  if (!password.match(passwdRegExp)) return res.status(400).json({ error: "HIBA! Az általad megadott jelszó nem elég erős!" });
  query(`SELECT id FROM ${table} where email=?`, [email], (err, res) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length != 0) return res.status(400).json({ error: "HIBA! Az általd választot e-mail cím már foglalt!" });

    query(`INSERT INTO ${table} (name, email, password, role) VALUES (?,?,?, 'user')`, [name, email, SHA1(password).toString()], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      logger.verbose(`[POST /${table}] -> ${results.length} rekord feltöltésre került.`)
      res.status(200).send(results);
    }, req);
  }, req)

});

//ADD NEW record to :table
router.post('/:table', (req, res) => {
  const table = req.params.table;
  const fields = Object.keys(req.body).join(',');
  const values = '"' + Object.values(req.body).join('", "') + '"'
  query(`INSERT INTO ${table} (${fields}) VALUES (${values})`, [], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[POST /${table}] -> ${results.length} rekord feltöltésre került.`)
    res.status(200).send(results);
  }, req);
});

//UPDATE records in :table by :id

router.patch('/:table/:id', (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  let updates = [];
  for (let i = 0; i < fields.length; i++) {
    updates.push(`${fields[i]}='${values[i]}'`)
  }
  let str = updates.join(',')
  query(`UPDATE ${table} SET ${str}  WHERE id=?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[POST /${table}] -> ${results.length} rekord feltöltésre került.`)
    res.status(200).send(results);
  }, req);
})

//DELETE ONE RECORD BY ID FROM TALBE
router.delete("/:table/:id", (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  query(`DELETE FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[DELETE /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});

//DELETE ALL RECORDS
router.delete("/:table/", (req, res) => {
  const table = req.params.table;
  query(`DELETE FROM ${table}`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    logger.verbose(`[DELETE /${table}] -> ${results.length} rekord küldve válaszként`)
    res.status(200).send(results);
  }, req);
});
module.exports = router;

function getOp(op){
  switch(op){
    case 'eq':    {op = ' = '; break;}
    case 'lt':    {op = ' < '; break;}
    case 'lte':   {op = ' <= '; break;}
    case 'gt':    {op = ' > '; break;}
    case 'gte':   {op = ' >= '; break;}
    case 'not':   {op = ' <> '; break;}
    case 'lk':    {op = ' LIKE '; break;}
  }
}

/*
http://localhost:3000/user
*/