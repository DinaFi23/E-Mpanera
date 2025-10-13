const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
// const pool = require('./database'); // Importez votre fichier de configuration

// app.get('/Admin', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Erreur lors de la récupération des utilisateurs.');
//   }
// });

app.get('/', (req, res) => {
    // envoye vers clients
    res.sendFile(path.join(__dirname, 'Public/Account/users/index.html'));
  })

app.get('/Admin', (req, res) => {
    // envoye vers Admin
    res.sendFile(path.join(__dirname, 'Public/Account/Admin/index.html'));
})


app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})
