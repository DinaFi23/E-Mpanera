const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.get('/', (req, res) => {
    // envoye vers clients
    res.sendFile(path.join(__dirname, 'Public/index.html'));
})

app.listen(port, () => {
  console.log(`le Serveur est lancé sur le port  ${port}`)
})
