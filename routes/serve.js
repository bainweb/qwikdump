const config = require('../config');
const fs = require('fs');
const path = require('path');

module.exports = routes;

async function routes(fastify) {
    fastify.get('/f/:id(.+)', serveFile);
}

function readMeta(id) {
    return JSON.parse(fs.readFileSync(path.join(config.metaDir, id)));
}

function logServeFile(req, meta) {
    console.log(req.params.id, 'Serving', meta.file.name, 'to', req.headers.host, 'at', Date.now());
}

function serveFile(req, res) {
    const meta = readMeta(req.params.id);
    logServeFile(req, meta);
    res.header('Content-Disposition', 'attachment; filename="'+ meta.file.name +'"');
    res.type(meta.file.mimetype).sendFile(path.join('uploads', req.params.id));
}