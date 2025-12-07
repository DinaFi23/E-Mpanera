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

app.set("view engine" , "ejs");
app.set("views" , "views");

app.use(express.static('Public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

//acces vers le client 
app.get('/', async (req, res) => {
  try {
    const result = await Connex.query('SELECT * FROM list ');
    res.render('client', { items: result.rows});
  } catch (err) {
    console.error('Error fetching list:', err);
    res.status(500).send('Erreur serveur');
  }
});


// recuperer le login 
app.get("/login", (req, res) => {
  res.render("login");
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
app.get("/admin", async (req, res) => {
  if (!req.session.admin) {
    return res.status(403).send("Accès refusé. Connectez-vous d'abord !");
  }

   try {
    const result = await Connex.query('SELECT * FROM list ');
    res.render('admin', { items: result.rows});
  } catch (err) {
    console.error('Error fetching list:', err);
    res.status(500).send('Erreur serveur');
  }

 //  res.render("admin");
  });

// 🔓 Déconnexion
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login") ;
  });
});

app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})


//Ajout de donnée 
app.post('/Add', (req, res) => {

const { Lieu, Type, Dimension, Electricité, Eau, Loyer, Contact } = req.body;
  
const insert = 'INSERT INTO list (lieu, typa, dimension, electricite, eau, loyer, contact) VALUES ($1,$2,$3,$4,$5,$6,$7)'
  Connex.query(insert,[ Lieu, Type, Dimension, Electricité, Eau, Loyer, Contact ],(err, result) =>{
      if (err) {
         res.send(err)
      } else {
        res.redirect('/admin')
      }
  }) 
});


/*

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



app.delete('/delete/:list',(req, res) => {
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

*/

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Connex.query("DELETE FROM list WHERE id = $1", [id]);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.send("Erreur lors de la suppression");
  }

});


app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  const result = await Connex.query("SELECT * FROM users WHERE id = $1", [id]);

  res.render("edit", { user: result.rows[0] });
});
 