const path = require('path');

module.exports = {
    publicDir: path.join(__dirname, 'public'), // public file dir
    uploadsDir: path.join(__dirname, 'public', 'uploads'), // where uploads are stored (must be in public to be served_
    metaDir: path.join(__dirname, 'meta'), // where meta files are stored
    multipart: { // busboy options
        limits: {
            files: 1,
            fileSize: 99999, // bytes
        }
    }
};