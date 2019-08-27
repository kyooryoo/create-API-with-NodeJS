const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const files = [
    `0_sample.txt`,
    `0_sample.txt`,
    `0_sample.txt`
];

const promises = files.map(file => 
    readFile(`${__dirname}/${file}`, 'utf8'));

Promise.all(promises)
    .then(data => {data.forEach(text => console.log(text))})
    .catch(error => console.log('err: ', error));