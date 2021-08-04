// just a console log decorator
module.exports = function log(id, ...args) {
    console.log(`[${new Date().toLocaleString()}] [${id}]`, ...args);
}

