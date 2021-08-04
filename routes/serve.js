const config = require('../config');
const log = require('../log');
const files = require('../files');
const path = require('path');

module.exports = routes;

async function routes(fastify) {
    fastify.register(require('fastify-rate-limit'), { max: config.rateLimits.downloadsPerMinute});
    fastify.get('/f/:id', serveFile);
}

async function serveFile(req, res) {
    const id = req.params.id.replace(/[^\d\w_\-]/,'');
    try {
        const meta = await files.readMeta(id);
        log(id, 'Serving to', req.socket.remoteAddress);
        res.header('Content-Disposition', 'attachment; filename="'+ meta.file.name +'"');
        res.type(meta.file.mimetype)
        res.sendFile(id, files.paths.file(''));
    }
    catch (err) {
        log(id, err.message || err);
        res.status(404).send('File not found.');
    }
    return res;
}
