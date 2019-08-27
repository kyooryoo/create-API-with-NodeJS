const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
let file = `${__dirname}/0_sample.txt`;

async function readFiles() {
    const content1 = await readFile(file);
    const content2 = await readFile(file);
    const content3 = await readFile(file);

    return 'Content 1\n' + content1 + '\n\nContent 2 \n' 
        + content2 + '\n\nContent 3\n' + content3;
}

readFiles().then(result => console.log(result));