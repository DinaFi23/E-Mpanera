const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const dotenv = require('dotenv')
const pg = require('pg')
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});


async function testC() {
  try { 
    const res = await
    pool.query("SELECT NOW()");
    console.log('Connection reussi');
    console.log("heure du serveur : ", res.rows[0].now);
  } catch (error) {
    console.error("erreur du connection :", error.message);
  } finally {
    pool.end();
  }
}

testC();
app.get('/', (req, res) => {
    // envoye vers clients
    const query = SELECT * FROM list 
    res.sendFile(path.join(__dirname, 'Public/index.html'));
})

app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})
