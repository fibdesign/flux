import http from 'http';

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
                    // Add the matched params to the request
                    fluxReq.params = match.params || {};
                    this.executeRoute(route, fluxReq, fluxRes);
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
        return req.method === route.method && req.url === route.path;
    }

    executeRoute(route, req, res) {
        // TODO: remove the .toString
        for (const mw of route.middlewares) {
            const result = this.interpreter.callFunction(mw, [req.toString()]);
            if (result === false) return; // Middleware blocked
        }

        const result = this.interpreter.callFunction(route.handler, [JSON.stringify(req)]);
        res.send(result);
    }

    listen(port) {
        this.server.listen(port, () => {
            console.log(`🌐 Flux HTTP server running on port ${port} \n http://localhost:3000`);
        });
    }
}