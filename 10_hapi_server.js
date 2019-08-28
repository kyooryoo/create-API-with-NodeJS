const Hapi = require('hapi');
const routes ={};
routes.todo = require('./0_todo');

const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
            return { message: 'Hello World! Again!'};
        }
    });

    server.route(routes.todo);

    const options = {
        ops: {
            interval: 100000
        },
        reporters: {
            consoleReporters: [
                { module: 'good-console' },
                'stdout'
            ]
        }
    };

    await server.register({
        plugin: require('good'),
        options
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();