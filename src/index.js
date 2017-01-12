// @flow

'use strict'

import * as http from 'http'
import debug from 'debug'
import Api from './Api'

// Error interface for use on Error
// this error type is used by express
declare interface ErrnoError extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
}

const logger = debug('flow-api:startup');
const app: Api = new Api();
const DEFAULT_PORT: number = 3000;
const port: string | number = normalizePort(process.env.PORT);
const server: http.Server = http.createServer(app.express);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


// looks for the $port enviroment variable and sets
// the apps port to its value
//  if it doesn't exist, it sets the port to the
//  default value - 3000
function normalizePort(val: any): number | string {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;

  if (port && isNaN(port)) return port;
  else if (port >= 0) return port;
  else return DEFAULT_PORT;

}


// error handler for HTTP server.
function onError(error: ErrnoError): void {
  if (error.syscall !== 'listen') throw error;
  let bind: string = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port.toString()}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// listening for requests
function onListening(): void {
  let addr: string = server.address();
  let bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  logger(`Listening on ${bind}`);
}
