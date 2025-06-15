// utils/http.js

const http = require('http');
const { showFluxRoutes } = require('./fluxRoutesView.js');
const { readFileSync } = require('fs');
const { join, resolve } = require('path');
const { showUpPage } = require('./fluxUpView.js');
const { exec } = require('child_process');
const { showWelcomePage } = require('./fluxWelcomeView.js');

function wrapRequest(rawReq, params = {}) {
    const reqObj = {
        __fluxType: 'fluxReq',
        method: rawReq.method,
        url: rawReq.url,
        headers: rawReq.headers,
        queries: {},
        params: params,
    };

    const url = new URL(rawReq.url, `http://${rawReq.headers.host}`);
    for (const [key, value] of url.searchParams.entries()) {
        reqObj.queries[key] = value;
    }

    return reqObj;
}

function parseRouteParams(routePath, requestPath) {
    const params = {};
    const routeParts = routePath.split('/').filter(Boolean);
    const pathParts = requestPath.split('/').filter(Boolean);

    if (routeParts.length !== pathParts.length) return {};

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith('#')) {
            const paramName = routeParts[i].substring(1);
            params[paramName] = decodeURIComponent(pathParts[i]);
        }
    }

    return params;
}

class HTTPServer {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.routes = this.interpreter?.routers ?? [];
    }

    handleRequest(req, res) {
        const fluxReq = {
            url: req.url,
            method: req.method,
            headers: req.headers,
            queries: {},
            params: {}
        };

        const fluxRes = {
            send: (text) => res.end(text),
            json: (obj) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(obj));
            },
            status: (code) => {
                res.statusCode = code;
                return fluxRes;
            }
        };

        try {
            if (!Array.isArray(this.routes)) {
                res.statusCode = 500;
                return res.end('Server configuration error: routes not properly initialized');
            }

            let matched = false;

            if (req.url === '/__flux__welcome' && req.method === 'GET') {
                showWelcomePage(res);
                return;
            }

            if (req.url === '/__flux__routes' && req.method === 'GET') {
                showFluxRoutes(this.interpreter.routers, res);
                return;
            }

            if (req.url === '/__flux__up' && req.method === 'GET') {
                showUpPage(res);
                return;
            }

            for (const route of this.routes) {
                const match = this.matchRoute(route, req);
                if (match) {
                    const reqWrapped = wrapRequest(req);
                    reqWrapped.params = match.params || {};
                    this.executeRoute(route, reqWrapped, fluxRes);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                res.statusCode = 404;
                res.end('Not found');
            }
        } catch (error) {
            console.error('Request handling error:', error);
            res.statusCode = 500;
            res.end(`Server error: ${error.message}`);
        }
    }

    matchRoute(route, req) {
        if (req.method !== route.method) return false;

        const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;
        const routeParts = route.path.split('/').filter(Boolean);
        const pathParts = requestPath.split('/').filter(Boolean);

        if (routeParts.length !== pathParts.length) return false;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith('#')) continue;
            if (routeParts[i] !== pathParts[i]) return false;
        }

        return {
            params: parseRouteParams(route.path, requestPath)
        };
    }

    executeRoute(route, req, res) {
        for (const mw of route.middlewares) {
            const result = this.interpreter.callFunction(mw, [req]);
            if (result === false) return;
        }

        const result = this.interpreter.callFunction(route.handler, [req]);
        res.send(result);
    }

    listen() {
        const projectRoot = process.cwd();
        const projectJson = JSON.parse(readFileSync(join(projectRoot, 'flux.json'), 'utf8'));
        const coreVersionJson = require('../package.json');
        const port = projectJson.port || 2351;
        this.server.listen(port, () => {
            const Reset = '\x1b[0m';
            const Dim = '\x1b[2m';
            const Bright = '\x1b[1m';
            const Cyan = '\x1b[36m';
            const Magenta = '\x1b[35m';
            const Yellow = '\x1b[33m';
            const Green = '\x1b[32m';
            const Blue = '\x1b[34m';

            const line = `${Dim}────────────────────────────────────────────${Reset}`;

            if (!process.env.__FLUX_BROWSER_OPENED__){
                console.clear();
                console.log(`${Green}🌐  Flux HTTP Server is Running${Reset}`);
                console.log(line);
                console.log(`  ➜  ${Bright}Local:${Reset}        ${Cyan}http://localhost:${port}${Reset}`);
                console.log(`  ➜  ${Bright}Project:${Reset}      ${Magenta}${projectJson.name} v${projectJson.version}${Reset}`);
                console.log(`  ➜  ${Bright}Core:${Reset}         ${Magenta}${coreVersionJson.name} v${coreVersionJson.version}${Reset}`);
                console.log(`  ➜  ${Bright}Environment:${Reset}  ${Yellow}development${Reset}`);
                console.log(`  ➜  ${Bright}Interpreter:${Reset}  ${Blue}Node.js ${process.version}${Reset}`);
                console.log(line);
                console.log(`  ➜  ${Bright}Flux Page:${Reset}     ${Cyan}http://localhost:${port}/__flux__routes${Reset} ${Dim}(routes viewer)${Reset}`);
                console.log(`  ➜  ${Bright}Flux Page:${Reset}     ${Cyan}http://localhost:${port}/__flux__up${Reset}     ${Dim}(status page)${Reset}`);
                console.log(line);
                console.log(`${Dim}Press Ctrl+C to stop the server${Reset}\n`);

                const url = `http://localhost:${port}/__flux__welcome`;
                const startCommands = {
                    win32: 'start',
                    darwin: 'open',
                    linux: 'xdg-open'
                };
                const startCommand = startCommands[process.platform];
                if (startCommand) {
                    exec(`${startCommand} ${url}`, (err) => {
                        if (err) {
                            console.error('Failed to open browser:', err);
                        }
                    });
                }
            }


        });
    }
}

module.exports = { HTTPServer };
