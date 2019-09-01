const Hapi = require('hapi');
const Knex = require('./12_db');

const routes ={};
routes.todo = require('./0_todo');
routes.auth = require('./14_auth');

const validate = async function (decoded, request) {
    // console.log(decoded.email);
    const [user] = await Knex('user').where({email: decoded.email});
    // console.log([user]);
    if (![user]) { return { isValid: false }; }
    else { return { isValid: true }; }
};

// create a new server
const server = new Hapi.server({ 
    port: process.env.PORT || 8000
});

const init = async () => {

    // define server authentication
    await server.register(require('hapi-auth-jwt2'));

    server.auth.strategy('token', 'jwt', {
        key: 'secretkey-hash',
        validate: validate,  // required for hapi-auth-jwt2
        verifyOptions: { algorithms: [ 'HS256' ] }
    });

    // define routes
    server.route({
        method: 'GET',
        path:'/',
        config: { auth: false }, // use false or 'token' to toggle auth
        handler: (request, h) => {
            return h.response({ message: 'Hello World!'})
            .header("Authorization", request.headers.authorization);
        }
    });

    server.route(routes.auth);

    const authRoutes = routes.todo.map(route => {
        route.config = { auth: 'token' }; // use false or 'token' to toggle auth
        return route;
    });
    
    server.route(authRoutes);

    // enable logging
    await server.register({
        plugin: require('good'),
        options: {
            ops: {
                interval: 1000000
            },
            reporters: {
                consoleReporters: [
                    { module: 'good-console' },
                    'stdout'
                ]
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

module.exports = server;
