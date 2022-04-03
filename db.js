const pg = require('pg')

var config = {
    user: 'ulxouuifxljact', // env var: PGUSER
    database: 'dbj733ha962jhl', // env var: PGDATABASE
    password: 'a29ff5ec3cb4ead4b7b8c92c2f01367eaeedb9325fe51d4a194ff3304803f9d8', // env var: PGPASSWORD
    host: 'ec2-63-34-223-144.eu-west-1.compute.amazonaws.com', // Server hosting the postgres database
    port: 5432, // env var: PGPORT
    rejectUnauthorized: false,
    ssl: true
  }

const pool = new pg.Pool(config)

exports.query = async function (q) {
  const client = await pool.connect()
  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err
    }
  } finally {
    client.release();
  }
  return res;
};