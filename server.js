const express = require('express');
// const path = require('path');
const app = express();
const port = 3000;
const dotenv = require('dotenv')
const pg = require('pg')
dotenv.config();
const { Client } = require('pg');

const Connex = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// conncection vers PostgreSql 
Connex.connect().then(()=>{
  console.log('Database Connected');
})
 
//récuperation de donnée 
app.get('/fetchdata', (req, res) => {
    const fetch = "Select * from list"
    Connex.query(fetch,(err, result)=>{
        if (err) {
          res.send(err);
        } else{
          res.send(result.rows);
        }
    })
})

app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})
