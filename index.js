const config = require('./config');
const fastify = require('fastify')();
const path = require('path');

fastify.register(require('fastify-multipart'), config.multipart);

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

fastify.register(require('./routes/home'));
fastify.register(require('./routes/serve'));
fastify.register(require('./routes/upload'));

fastify.listen(config.listenPort, config.listenHost,  err => {
    if (err) throw err;
    console.log(`qwikdump listening on ${config.listenHost}:${config.listenPort}`);
});
