const Log = require('../model/Log')

const logEvent = async (method, url, path) => {
    try {
        await Log.create({
            'method': method,
            'url': url,
            'path': path
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports =  logEvent ;