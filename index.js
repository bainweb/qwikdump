const fs = require('fs'),
    pump = require('pump'),
    shortid = require('shortid'),
    sanitize = require('sanitize-filename'),
    path = require('path'),
    fastify = require('fastify')(),
    publicDir = path.join(__dirname, 'public'),
    uploadsDir = path.join(publicDir, 'uploads'),
    metaDir = path.join(__dirname, 'meta');

fastify.register(require('fastify-multipart'));
fastify.register(require('fastify-static'), {
  root: __dirname + '/public/',
  prefix: '/',
});

fastify.get('/u/:id(.+)', (req, res) => {
    const meta = JSON.parse(fs.readFileSync(path.join(metaDir, req.params.id)));
    console.log(req.params.id, 'Serving to', req.headers.host, 'at', Date.now());
    res.header('Content-Disposition', 'attachment; filename="'+ meta.file.name +'"');
    res.type(meta.file.mimetype).sendFile(path.join('uploads', req.params.id));
});

fastify.get('/', (req, res) => {
    res.type('text/html').sendFile('index.html');
});

fastify.post('/', (req, res) => {
    const id = shortid.generate();
    
    const mp = req.multipart(handler, function (err) {
        if (err) return res.code(500).send(err);
        res.type('text/html').send('<a href="/u/' + id + '">Here it is</a>');
    });
    
    mp.on('field', function (key, value) {
        req.body = req.body || {};
        req.body[key] = value;
    });
    
    mp.on('file', function(field, file, filename) {
        console.log(id, 'Host', req.headers.host, 'uploaded', filename, 'at', Date.now());
        file.on('end', () => console.log(id, 'done'));
    });
    
    function handler (field, file, filename, encoding, mimetype) {
        //if (!req.body.email) return res.code(500).send('haha no');
        
        fs.writeFileSync(path.join(metaDir, id), JSON.stringify({
            headers: req.headers,
            file: {
                name: sanitize(filename),
                mimetype: mimetype
            }
        }, 0, 2));
        pump(file, fs.createWriteStream(path.join(uploadsDir, id)));
    }
});

fastify.listen(8080, err => {
    if (err) throw err;
    console.log('qwikdump started');
});