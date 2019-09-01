const Knex = require('./12_db');

Knex.raw('select 1+1 as sum')
  .catch((err) => console.log(err.message))
  .then(([res]) => console.log('connected: ', res[0].sum));