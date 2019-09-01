const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'P@ssw0rd',
      database: 'todo',
      charset: 'utf8',
    },
  }
};
configs.test = configs.development;
const Knex = require('knex')(configs[env]);

module.exports = Knex;
