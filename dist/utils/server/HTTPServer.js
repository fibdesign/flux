"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const http = __importStar(require("http"));
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const COLORS_1 = require("../../constants/COLORS");
const node_child_process_1 = require("node:child_process");
const FluxErrorHandler_1 = require("../FluxErrorHandler");
const show_flux_welcome_page_1 = require("./show.flux.welcome.page");
const show_flux_up_page_1 = require("./show.flux.up.page");
const show_flux_routes_page_1 = require("./show.flux.routes.page");
const execute_function_call_1 = require("../../core/interpreter/execute.function.call");
class HTTPServer {
    constructor(interpreter) {
        this.routes = [];
        this.server = http.createServer(this.handleRequest.bind(this));
        this.projectJson = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(process.cwd(), 'flux.json'), 'utf8'));
        this.coreVersionJson = require('../../../package.json');
        this.port = this.projectJson.port ?? 2351;
        this.interpreter = interpreter;
        this.routes = this.interpreter.Routes;
    }
    handleRequest(req, res) {
        if (!Array.isArray(this.routes)) {
            FluxErrorHandler_1.FluxErrorHandler.HttpError(res, 500, 'Server configuration error: routes not properly initialized');
        }
        let matched = false;
        if (req.url === '/__flux__welcome' && req.method === 'GET') {
            (0, show_flux_welcome_page_1.ShowFluxWelcomePage)(res);
            return;
        }
        if (req.url === '/__flux__up' && req.method === 'GET') {
            (0, show_flux_up_page_1.ShowFluxUpPage)(res);
            return;
        }
        if (req.url === '/__flux__routes' && req.method === 'GET') {
            (0, show_flux_routes_page_1.ShowFluxRoutesPage)(this.routes, res);
            return;
        }
        for (const route of this.interpreter.Routes) {
            const result = this.matchRoute(req, route);
            if (result) {
                const requestWrapped = this.wrapRequest(req);
                requestWrapped.params = result.params;
                this.executeRoute(route, requestWrapped, res);
                matched = true;
                break;
            }
        }
        if (!matched) {
            res.statusCode = 404;
            res.end('Not found');
        }
    }
    matchRoute(req, route) {
        if (req.method !== route.method)
            return false;
        const requestPath = new URL(req.url ?? '/', `http://${req.headers.host}`).pathname;
        const routeParts = route.path.split('/').filter(Boolean);
        const pathParts = requestPath.split('/').filter(Boolean);
        if (routeParts.length !== pathParts.length)
            return false;
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith('#'))
                continue;
            if (routeParts[i] !== pathParts[i])
                return false;
        }
        return {
            params: this.parseRouteParams(route.path, requestPath)
        };
    }
    parseRouteParams(routePath, requestPath) {
        const params = {};
        const routeParts = routePath.split('/').filter(Boolean);
        const pathParts = requestPath.split('/').filter(Boolean);
        if (routeParts.length !== pathParts.length)
            return {};
        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith('#')) {
                const paramName = routeParts[i].substring(1);
                params[paramName] = decodeURIComponent(pathParts[i]);
            }
        }
        return params;
    }
    wrapRequest(rawRequest, params = {}) {
        const reqObj = {
            type: 'fluxReq',
            method: rawRequest.method ?? 'GET',
            url: rawRequest.url ?? '/',
            headers: rawRequest.headers,
            queries: {},
            params: params,
        };
        const url = new URL(rawRequest.url ?? '/', `http://${rawRequest.headers.host}`);
        for (const [key, value] of url.searchParams.entries()) {
            reqObj.queries[key] = value;
        }
        return reqObj;
    }
    executeRoute(route, req, res) {
        // for (const middleware of route.middlewares) {
        //                 const result = executeFunctionCall(this.interpreter, middleware)
        //     if (result === false) return;
        // }
        route.handler.arguments = [req];
        const result = (0, execute_function_call_1.executeFunctionCall)(this.interpreter, route.handler);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            data: result
        }));
    }
    async listen() {
        await new Promise((resolve) => {
            this.server.listen(this.port, () => {
                this.showSuccessMessage();
                resolve();
            });
        });
    }
    showSuccessMessage() {
        const line = `${COLORS_1.COLORS.Dim}────────────────────────────────────────────${COLORS_1.COLORS.Reset}`;
        if (process.env.__FLUX_BROWSER_OPENED__ == 'true')
            return;
        console.log(this.port);
        console.clear();
        console.log(`${COLORS_1.COLORS.Green}🌐  Flux HTTP Server is Running${COLORS_1.COLORS.Reset}`);
        console.log(line);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Local:${COLORS_1.COLORS.Reset}        ${COLORS_1.COLORS.Cyan}http://localhost:${this.port}${COLORS_1.COLORS.Reset}`);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Project:${COLORS_1.COLORS.Reset}      ${COLORS_1.COLORS.Magenta}${this.projectJson?.name} v${this.projectJson.version}${COLORS_1.COLORS.Reset}`);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Core:${COLORS_1.COLORS.Reset}         ${COLORS_1.COLORS.Magenta}flux v${this.coreVersionJson.version}${COLORS_1.COLORS.Reset}`);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Environment:${COLORS_1.COLORS.Reset}  ${COLORS_1.COLORS.Yellow}development${COLORS_1.COLORS.Reset}`);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Interpreter:${COLORS_1.COLORS.Reset}  ${COLORS_1.COLORS.Blue}Node.js ${process.version}${COLORS_1.COLORS.Reset}`);
        console.log(line);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Flux Page:${COLORS_1.COLORS.Reset}     ${COLORS_1.COLORS.Cyan}http://localhost:${this.port}/__flux__routes${COLORS_1.COLORS.Reset} ${COLORS_1.COLORS.Dim}(routes viewer)${COLORS_1.COLORS.Reset}`);
        console.log(`  ➜  ${COLORS_1.COLORS.Bright}Flux Page:${COLORS_1.COLORS.Reset}     ${COLORS_1.COLORS.Cyan}http://localhost:${this.port}/__flux__up${COLORS_1.COLORS.Reset}     ${COLORS_1.COLORS.Dim}(status page)${COLORS_1.COLORS.Reset}`);
        console.log(line);
        console.log(`${COLORS_1.COLORS.Dim}Press Ctrl+C to stop the server${COLORS_1.COLORS.Reset}\n`);
        // open welcome page
        const url = `http://localhost:${this.port}/__flux__welcome`;
        const startCommands = {
            win32: 'start',
            darwin: 'open',
            linux: 'xdg-open'
        };
        const startCommand = startCommands[process.platform];
        if (!startCommand)
            return;
        (0, node_child_process_1.exec)(`${startCommand} ${url}`, (err) => {
            if (err) {
                FluxErrorHandler_1.FluxErrorHandler.error(`Failed to open browser: ${JSON.stringify(err)}`);
            }
        });
    }
}
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=HTTPServer.js.map