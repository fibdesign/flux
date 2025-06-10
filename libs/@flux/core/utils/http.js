// http.js

import http from 'http';

function wrapRequest(rawReq) {
    return {
        __fluxType: 'fluxReq',
        method: rawReq.method,
        url: rawReq.url,
        headers: rawReq.headers,
        query: {},   // you can parse query if needed
        params: {},  // set during route matching
    };
}

export class HTTPServer {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.routes = this.interpreter?.routers ?? []
    }

    handleRequest(req, res) {
        const fluxReq = {
            url: req.url,
            method: req.method,
            headers: req.headers,
            query: {},
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
            // Use the flattened routes that were processed
            if (!Array.isArray(this.routes)) {
                res.statusCode = 500;
                return res.end('Server configuration error: routes not properly initialized');
            }

            let matched = false;
            for (const route of this.routes) {
                const match = this.matchRoute(route, req);
                if (match) {
                    const reqWrapped = wrapRequest(req);
                    fluxReq.params = match.params || {};
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

        const routeParts = route.path.split('/').filter(Boolean);
        const urlParts = new URL(req.url, `http://${req.headers.host}`).pathname.split('/').filter(Boolean);

        if (routeParts.length !== urlParts.length) return false;

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith('#')) {
                const paramName = routeParts[i].slice(1);
                params[paramName] = urlParts[i];
            } else if (routeParts[i] !== urlParts[i]) {
                return false;
            }
        }

        return { params };
    }


    executeRoute(route, req, res) {
        for (const mw of route.middlewares) {
            const result = this.interpreter.callFunction(mw, [req]);
            if (result === false) return; // Middleware blocked
        }

        const result = this.interpreter.callFunction(route.handler, [req]);
        res.send(result);
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`🌐 Flux HTTP server running on port ${port} \n http://localhost:3000`);
        });
    }
}