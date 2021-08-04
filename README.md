# qwikdump
Bare-bones node.js file hosting server built with fastify

## Getting started
```
git clone https://github.com/obscure-web/qwikdump.git
cd qwikdump
npm i
node .
```

## Configuration
edit config.json as you wish and restart the server
```
{
    "listenHost": "0.0.0.0", // change to "localhost" if you do not want to accept external connections
    "listenPort": 3000, // you might want 80
    "uploadsDir": "uploads", // relative to app root. all your files will be put in here
    "rateLimits": { // per-ip-address rate limits
        "uploadsPerMinute": 5,
        "downloadsPerMinute": 5
    },
    "multipart": {
        "limits": {
            "files": 1, // keep this. multiple files per request aren't supported
            "fileSize": 10485760 // max payload size in bytes
        }
    }
}
```

## Pull requests
I will entertain pull requests for bug fixes and maybe new features, but this is intended to be forked and extended to your liking.
