const fs = require('fs');

let file = `${__dirname}/0_sample.txt`;

const callback = (err, data) => {
    if (err) throw err;
    console.log(data);
};

fs.readFile(file, 'utf8', callback);

console.log('Guess when this come out?');