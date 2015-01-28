var winston = require('winston');
require('winston-logstash-udp');

require('should');

var configure = require('../');

describe('winston-configure', function() {

	beforeEach(function() {
		delete winston.loggers.loggers.myLogger;
		delete winston.loggers.loggers.myLogger2;
	});

	it('should throw an error if given unknown transport', function() {
		(function() {
			configure({
				loggers: {
					default: [{
						type: 'console'
					}]
				}
			});
		}).should.throw();
	});

	it('should configure the default transports', function() {
		configure({
			loggers: {
				default: [{
					type: 'Console',
					name: 'logger-console-1',
					level: 'error'
				}]
			}
		});

		winston.loggers.default.transports.should.have.lengthOf(1);

		winston.loggers.get('unknownlogger').transports.should.have.property('logger-console-1');
	});

	it('should configure a specific logger', function() {
		configure({
			loggers: {
				myLogger: [{
					type: 'Console',
					name: 'logger-console-1',
					level: 'error'
				}]
			}
		});

		winston.loggers.get('myLogger').transports.should.have.property('logger-console-1');
	});

	it('should support using an additional transport', function() {
		configure({
			loggers: {
				myLogger: [{
					type: 'LogstashUDP',
					level: 'error'
				}]
			}
		});

		winston.loggers.get('myLogger').transports.should.have.property('logstashUdp');
	});

	it('should support silencing a logger', function() {
		configure({
			loggers: {
				myLogger: []
			}
		});

		Object.keys(winston.loggers.get('myLogger').transports).should.have.lengthOf(1);
		winston.loggers.get('myLogger').transports.should.have.property('console').with.property('silent', true);
	});

	it('should support shared transports', function() {
		configure({
			transports: {
				myConsole: {
					type: 'Console',
					level: 'error'
				}
			},
			loggers: {
				myLogger: ['myConsole'],
				myLogger2: ['myConsole', {
					type: 'File',
					level: 'error',
					filename: 'test.log'
				}]
			}
		});

		winston.loggers.get('myLogger').transports.should.have.property('myConsole');
		winston.loggers.get('myLogger2').transports.should.have.property('myConsole');
		winston.loggers.get('myLogger2').transports.should.have.property('file');
	});

	it('should run the README example', function() {
		configure({
			transports: {
				errorConsole: {
					type: 'Console',
					level: 'error'
				},
				debugConsole: {
					type: 'Console',
					level: 'debug'
				}
			},
			loggers: {
				default: ['errorConsole'], // a logger created and not specifically configured will get these transports
				myLogger: [], // this logger will be silent
				myLogger2: ['debugConsole', {
					type: 'File',
					level: 'error',
					filename: 'test.log'
				}] // this logger will use the shared debugConsole transport and a custom file transport definition
			}
		});

		/*console.log('Default transports: ');
		console.log(winston.loggers.default.transports);
		console.log('myLogger transports: ');
		console.log(winston.loggers.get('myLogger').transports);
		console.log('myLogger2 transports: ');
		console.log(winston.loggers.get('myLogger2').transports);
		console.log('anotherLogger transports: ');
		console.log(winston.loggers.get('anotherLogger').transports);*/

	});

});