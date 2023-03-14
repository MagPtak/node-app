module.exports = function() {

  process.on('uncaughtException', (ex) => {
    winston.error(ex.message, ex)
  })

  process.on('unhandledRejection', (ex) => {
    winston.error(ex.message, ex)
  })

  winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});

}