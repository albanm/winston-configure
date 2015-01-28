var winston = require('winston');

module.exports = function(options) {

	// No noisy default behavior, the purpose of this module is explicit configuration
	winston.loggers.default.transports[0].silent = true;

	options.transports = options.transports || {};
	options.loggers = options.loggers || {};

	Object.keys(options.loggers).forEach(function(loggerName) {

		var loggerOptions = options.loggers[loggerName];

		var loggerTransports = loggerOptions.map(function(transportOptions) {
			if (typeof transportOptions === 'string' && options.transports[transportOptions]){
				options.transports[transportOptions].name = transportOptions;
				transportOptions = options.transports[transportOptions];
			}
			var Transport = winston.transports[transportOptions.type];
			if (!Transport) {
				throw new Error('winston-configure error - ' + transportOptions.type + ' transports unknown, avaiable transports are ' + JSON.stringify(Object.keys(winston.transports)));
			}
			return new Transport(transportOptions);
		});

		if (loggerName === 'default') {
			winston.loggers.options.transports = loggerTransports;
		} else {
			winston.loggers.add(loggerName, {
				transports: loggerTransports
			});
		}

	});

	var ownLogger = winston.loggers.get('winston-configure');
	ownLogger.debug('winston-configure configured %s logger(s)', Object.keys(options.loggers).length);
	for (var loggerName2 in options.loggers) {
		var transportOptions2 = options.loggers[loggerName2];
		ownLogger.debug('winston-configure configured "%s" logger on %s transport(s)', loggerName2, transportOptions2.length);
		ownLogger.silly('winston-configure configured "%s" logger with using following options', loggerName2, transportOptions2);
	}
};