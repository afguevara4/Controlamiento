const {createLogger, format, transports} = require('winston');

module.exports = createLogger({
    format: format.combine(
        format.simple(), 
        format.timestamp(),
        format.printf(info => `[${info.timestamp} ${info.message}]`)
    ),
    transports: [
        new transports.File({
            
            filename: `${__dirname}/../logs/log-api.log`
        })
    ]
})