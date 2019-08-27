const request = require('request');
const url =  'https://www.bing.com';

request(url,  (error,  response, body) => {
    if  (error) console.log('error: ', error);
    else console.log('body: ', body);
});