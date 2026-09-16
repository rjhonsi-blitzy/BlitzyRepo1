/**
 * Plain-text HTTP greeting service, and the only executable file in this
 * repository. Loading this module is what runs it: starting the listener is a
 * load-time side effect, so `node server.js` and `require('./server.js')` both
 * start the service. The module exports nothing, so a caller that requires it
 * receives an empty object once that listener startup has been initiated -
 * `server.listen` is asynchronous, so the socket is not necessarily accepting
 * connections yet at that point; it is bound and listening only once the
 * readiness callback has run. There is no way to load this file without
 * starting the service.
 * @file
 * @module server
 */

// Node.js core HTTP module: the sole dependency of this service, and nothing is installed from a package registry.
const http = require('http');

/**
 * Network interface the listener binds to, fixed in source as `'127.0.0.1'`.
 * Loopback-only: the listener accepts connections from this host and is
 * unreachable from any other host. No environment variable is read to obtain
 * the value.
 * @constant {string}
 */
const hostname = '127.0.0.1';

/**
 * TCP port the listener binds to, fixed in source as `3000`.
 * No fallback exists: when `3000` is already taken the bind fails and the
 * process aborts before the readiness callback runs.
 * @constant {number}
 */
const port = 3000;

/**
 * Request handler bound to the server's 'request' event. Performs the same
 * three operations for every request the runtime dispatches to it: `req` is
 * accepted but never inspected, so method, path, query string and body do not
 * alter what this handler does. Sets the status to `200`, sets `'Content-Type'` to
 * `'text/plain'`, then ends the response with the 34-byte greeting body
 * `'Hello, World Welcome to Sharebot!\n'`. Defines no throw path and no
 * non-200 branch.
 * @callback RequestHandler
 * @param {module:http.IncomingMessage} req Inbound request; never read.
 * @param {module:http.ServerResponse} res Response mutated in place.
 * @returns {void} Nothing is returned; the response is ended as a side effect.
 */

/**
 * HTTP server instance constructed at load time. The inline arrow function
 * passed here is the {@link RequestHandler}.
 * @constant {module:http.Server}
 */
const server = http.createServer((req, res) => {
  // Set the response status to `200` for every dispatched request; no non-200 path exists.
  res.statusCode = 200;
  // Set `'Content-Type'` to `'text/plain'` so clients do not render the body as markup.
  res.setHeader('Content-Type', 'text/plain');
  // Write the 34-byte greeting `'Hello, World Welcome to Sharebot!\n'` and terminate the response.
  res.end('Hello, World Welcome to Sharebot!\n');
});

/**
 * Readiness callback invoked once the socket is bound. Takes no parameters and
 * writes exactly one line to stdout, `Server running at http://127.0.0.1:3000/`,
 * resolved from `hostname` and `port`. It runs only after the bind succeeds,
 * and defines no error path.
 * @callback ReadyCallback
 * @returns {void} Nothing is returned; the startup line is written as a side effect.
 */

// Bind the listener to `127.0.0.1:3000` and register ReadyCallback as the third argument: this statement is what makes requiring or executing this file start the service.
server.listen(port, hostname, () => {
  // Write the startup line `Server running at http://127.0.0.1:3000/`: the only log statement this application writes, and once the bind has succeeded the only line the process puts on stdout, whereas a failed bind writes a stack trace to stderr and never reaches this call.
  console.log(`Server running at http://${hostname}:${port}/`);
});
