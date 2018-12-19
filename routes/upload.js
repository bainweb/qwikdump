const config = require('../config');
const fs = require('fs');
const path = require('path');
const pump = require('pump');
const sanitize = require('sanitize-filename');
const shortid = require('shortid');

module.exports = routes;

async function routes(fastify) {
    fastify.post('/upload', upload);
}

function deleteUpload(id) {
    fs.unlink(path.join(config.metaDir, id), err => err && console.error(err));
    fs.unlink(path.join(config.uploadsDir, id), err => err && console.error(err));
}

function handle(id, req) {
    return (field, file, filename, encoding, mimetype) => {
        writeMeta(id, req.headers, filename, mimetype);
        pump(file, fs.createWriteStream(path.join(config.uploadsDir, id)));
    }
}

function logFileSizeLimit(id) {
    console.log(id, 'File limit exceeded at', Date.now());
}

function logUploadEnd(id, req, filename) {
    console.log(id, 'Host', req.headers.host, 'uploaded', filename, 'at', Date.now());
}

function logUploadStart(id, req, filename) {
    console.log(id, 'Host', req.headers.host, 'uploading', filename, 'at', Date.now());
}

function onFileSizeLimit(id, res) {
    return () => {
        logFileSizeLimit(id);
        res.error = 'File size limit exceeded';
        deleteUpload(id);
    }
}

function respond(id, res) {
    return err => {
        err = err || res.error;
        if (err) return res.code(500).send(err);
        res.type('text/html').send('<a href="/f/' + id + '">Here it is</a>');
    }
}

function upload(req, res) {
    const id = shortid.generate();
    const mp = req.multipart(handle(id, req), respond(id, res));
    
    mp.on('field', saveFieldToBody(req));
    
    mp.on('file', function(field, file, filename) {
        logUploadStart(id, req, filename);
        file.on('end', () => {
            logUploadEnd(id, req, filename);
        });
        file.on('limit', onFileSizeLimit(id, res));
    });
}

function saveFieldToBody(req) {
    return (key, value) => {
        req.body = req.body || {};
        req.body[key] = value;
    };
}

function writeMeta(id, headers, filename, mimetype) {
    return fs.writeFileSync(
        path.join(config.metaDir, id),
        JSON.stringify({
            headers: headers,
            file: {
                name: sanitize(filename),
                mimetype: mimetype
            }
        }, 0, 2)
    );
}
