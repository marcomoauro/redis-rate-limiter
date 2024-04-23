import mysql from 'mysql2/promise'

let pool

export const query = async (sql, params) => {
  await getConnectionPool()
  const [results, ] = await pool.query(sql, params)
  return results
}

const getConnectionPool = async () => {
  if (!pool) {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      //port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }

  return pool
}