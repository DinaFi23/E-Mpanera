const express = require('express');
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

app.use(express.json());

 
//Ajout de donnée 
app.post('/Add', (req, res) => {
  const { titre,des,status } = req.body;
  const insert = 'INSERT INTO list (titre, des, status) VALUES ($1,$2,$3)'
  Connex.query(insert,[titre, des, status],(err, result) =>{
      if (err) {
         res.send(err)
      } else {
        console.log(result);
        res.send("POSTED DATA");
      }
  })
});


//récuperation de donnée spécifique
app.get('/fetchdatabyId/:list_id', (req, res) => {
  const list_id = req.params.list_id ;
  const fetch = "Select * from list where list_id  = $1"
    Connex.query(fetch,[list_id ],(err, result)=>{
      if (err) {
        res.send(err);
      } else {
        res.send(result.rows);
      }
  })
  
})

//récuperation de Tous les donnée 
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

//modification de donnée 
app.put('/update/:list_id', (req, res)=>{
  const list_id = req.params.list_id;
  const titre = req.body.titre;
  const des = req.body.des;
  const status = req.body.status;

  const Mdquery = 'UPDATE list SET titre = $2 ,des = $3 ,status = $4 WHERE list_id = $1'
  Connex.query(Mdquery,[list_id, titre, des, status],(err, result)=>{
    if (err) {
      res.send(err);
    } else {
      res.send("UPDATE");
    }
})
});

//effacement de donnée 
app.delete('/delete/:list_id',(req, res) => {
  const list_id = req.params.list_id ;
  const del = " delete from list where list_id = $1 "
    Connex.query(del,[list_id],(err, result)=>{
      if (err) {
        res.send(err);
      } else {
        res.send("DELETED");
      }
  })
  
})




app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})

