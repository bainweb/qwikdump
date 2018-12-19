module.exports = routes;

async function routes(fastify) {
    fastify.get('/', sendIndex);
}

function sendIndex(req, res) {
    res.type('text/html').sendFile('index.html');
}
