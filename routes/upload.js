const config = require('../config');
const log = require('../log');
const files = require('../files');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)
const shortid = require('shortid');
module.exports = routes;

async function routes(fastify) {
    fastify.register(require('fastify-rate-limit'), { max: config.rateLimits.uploadsPerMinute});
    fastify.post('/upload', upload);
}

// early out if our content length is much larger than our maximum file size
function checkContentLength(id, req, res) {
    if (req.headers['content-length'] > config.multipart.limits.fileSize + 228) {
        throw {statusCode: 413};
    }
}

// send a 200 or 500 response
function respond(id, res, err) {
    err = err || res.error;
    if (err) {
        return res.code(500).send(err);
    }
    res.type('text/html').send('<a href="/f/' + id + '">Here it is</a>');
}

// handle attempt to upload too large of a file
async function respondTooBuku(id, req, res) {
    log(id, 'Too buku');
    
    // delete partial file if it exists
    files.unlink(id);
    
    // send 'Payload Too Large' response
    res.status(413).send(`File size limit exceeded (${config.multipart.limits.fileSize} bytes)`);

    // give the browser a second to display our error message
    await new Promise(resolve => setTimeout(resolve, 1000));

    // destroy socket connection since most browsers ignore standards and continue to send data after they receive errors
    req.socket.destroy('tl;dr');
}

// upload route
async function upload(req, res) {
    const id = shortid.generate();
    log(id, 'Upload requested from', req.socket.remoteAddress);
    try {
        checkContentLength(id, req, res);
        
        const data = await req.file();
        log(id, 'upload started', data.filename);
        await pump(data.file, fs.createWriteStream(files.paths.file(id)));
        log(id, 'upload finished', data.filename);
        await files.writeMeta(id, req.headers, data.filename, data.mimetype);
        log(id, 'meta file created');
        
        respond(id, res);
    }
    catch (err) {
        if (err.statusCode === 413) {
            respondTooBuku(id, req, res);   
        }
        else {
            console.error(id, err);
            respond(id, res, "Server exploded");
        }
    }
}
