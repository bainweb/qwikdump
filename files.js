const config = require('./config');
const log = require('./log');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const paths = {
    file: id => path.join(__dirname, config.uploadsDir, 'files', id),
    meta: id => path.join(__dirname, config.uploadsDir, 'meta', id)
};

// make directories if necessary
(async () => {
    await fs.promises.mkdir(paths.file(''), { recursive: true });
    await fs.promises.mkdir(paths.meta(''), { recursive: true });
})();

// suppress file not found errors
function logUnlinkError(id) {
    return err => err && err.code !== 'ENOENT' && log(id, err);
}

// delete file and meta file
function unlink(id) {
    fs.unlink(paths.file(id), logUnlinkError(id));
    fs.unlink(paths.meta(id), logUnlinkError(id));
}

// read meta file
async function readMeta(id) {
    return JSON.parse(await fs.promises.readFile(paths.meta(id), 'utf-8'));
}

// dump out a JSON formatted meta file
// returns a promise
function writeMeta(id, headers, filename, mimetype) {
    const meta = { headers, file: { name: sanitize(filename), mimetype } };
    return fs.promises.writeFile(paths.meta(id), JSON.stringify(meta, 0, 2));
}

module.exports = { paths, unlink, readMeta, writeMeta };
