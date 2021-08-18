# qwikdump
Bare-bones node.js file hosting server built with fastify

## Getting started
```
git clone https://github.com/obscure-web/qwikdump.git
cd qwikdump
npm i
npm run config
node .
```

## Configuration
Run this command to interactively create or modify your config file
```
npm run config
```
Alternatively, you can copy config-defaults.json to config.json and modify it manually
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

## Contribute
This is intended to be forked and extended to your liking, but feel free to create merge requests.
