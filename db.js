const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'personal_budget_II',
  password: 'postgres',
  port: 5432,
});

export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }