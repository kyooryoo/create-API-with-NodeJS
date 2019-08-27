const fs = require('fs');
const util = require('util');
const promise = util.promisify(fs.readFile);
let file = `${__dirname}/0_sample.txt`;

promise(file, 'utf8')
    .then(data => console.log(data))
    .catch(error => console.log('err: ', error));