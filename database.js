const { Pool } = require('pg');

const pool = new Pool({
  user: 'votre_utilisateur',
  host: 'localhost',
  database: 'Empanera',
  password: '',
  port: 5432,
});

module.exports = pool;