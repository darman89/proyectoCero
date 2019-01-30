module.exports = {
  development: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "storage": "../database.sqlite",
    "dialect": "sqlite"
  },
  test: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "storage": "../database.sqlite",
    "dialect": "sqlite"
  },
  production: {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "storage": "../database.sqlite",
    "dialect": "sqlite"
  }
};