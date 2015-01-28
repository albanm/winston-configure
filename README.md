# winston-configure

*Declarative configuration for winston loggers.*

Supports:
  - Configuring multiple loggers in one command
  - Configuring the default transports for none specific loggers
  - Using shared transports definitions

## Install

    npm install winston-configure

## Usage

    ```javascript
    var winstonConfigure = require('winston-configure');

    winstonConfigure({
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

	var myLogger = winston.loggers.get('myLogger');
    ```