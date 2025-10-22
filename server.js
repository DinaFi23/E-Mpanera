const express = require('express');
const bcrypt = require('bcrypt');
const session =  require('express-session')
const path = require('path');
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

app.use(express.static("Public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

//acces vers le client 
app.get("/", (req, res) => {
  res.redirect('/logout')
});

// recuperer le login 
app.get("/login", (req, res) => {
  res.sendFile("index.html", { root: "./Public" });
});

// 🔹 Page de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await Connex.query("SELECT * FROM admin WHERE username = $1", [
    username,
  ]);

  if (result.rows.length === 0) {
    return res.status(401).send("Utilisateur introuvable");
  }

  const hash = await bcrypt.hash(password, 10); // mot de passe clair → hashé
  Connex.query("UPDATE admin SET password = $1 WHERE username = $2", [hash, "Dina"]);

  const admin = result.rows[0];
  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword) {
    return res.status(401).send("Mot de passe incorrect");
    
  }

  
  // Authentification réussie
  req.session.admin = admin.username;
  res.redirect("/admin");
});

// 🔒 Route protégée
app.get("/admin", (req, res) => {
  if (!req.session.admin) {
    return res.status(403).send("Accès refusé. Connectez-vous d'abord !");
  }

  res.sendFile("admin.html", { root: "./Public" });
});

// 🔓 Déconnexion
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.sendFile("client.html", { root: "./Public" });
  });
});

app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})


