const config = require('./config');
const fastify = require('fastify')();

fastify.register(require('fastify-multipart'), config.multipart);

fastify.register(require('fastify-static'), {
  root: config.publicDir,
  prefix: '/',
});

fastify.register(require('./routes/home'));
fastify.register(require('./routes/serve'));
fastify.register(require('./routes/upload'));

fastify.listen(8080, err => {
    if (err) throw err;
    console.log('qwikdump started');
});