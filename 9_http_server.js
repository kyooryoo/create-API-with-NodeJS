const http = require('http');
const server = http.createServer((request, response) => {
    console.log('Request starting...');
    response.write('Hello World!');
    response.end();
});

server.listen(5000, () => console.log('Server running at http://localhost:5000'));