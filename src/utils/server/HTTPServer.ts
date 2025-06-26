import * as http from "http";
import {TODO} from "../../types/TODO";
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {COLORS} from "../../constants/COLORS";
import {exec} from "node:child_process";
import {FluxErrorHandler} from "../FluxErrorHandler";
import {ShowFluxWelcomePage} from "./show.flux.welcome.page";
import {IProjectFluxJson} from "../../types/IProjectFluxJson";
import {ShowFluxUpPage} from "./show.flux.up.page";
import {ShowFluxRoutesPage} from "./show.flux.routes.page";
import {Interpreter} from "../../core/interpreter";
import {evaluateFunctionCall} from "../../core/interpreter/evaluate.function.call";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {IFuxRequestNode, IRouteEnv} from "../../types/TFluxAST";
import {IncomingMessage, ServerResponse} from "node:http";
import {IResponse} from "../../types/IResponse";

export class HTTPServer {
    private server: http.Server;
    private readonly projectJson: IProjectFluxJson;
    private readonly coreVersionJson: TODO;
    private readonly port: number;
    private readonly routes: IRouteEnv[] = [];
    private readonly interpreter: Interpreter;

    constructor(interpreter: Interpreter) {
        this.server = http.createServer(this.handleRequest.bind(this));
        this.projectJson = JSON.parse(readFileSync(join(process.cwd(), 'flux.json'), 'utf8'));
        this.coreVersionJson = require('../../../package.json');
        this.port = this.projectJson.port ?? 2351;
        this.interpreter = interpreter;
        this.routes = this.interpreter.Routes;
    }

    handleRequest(req: IncomingMessage, res: ServerResponse) {


        if (!Array.isArray(this.routes)) {
            FluxErrorHandler.HttpError(res, 500, 'Server configuration error: routes not properly initialized')
        }

        let matched = false;
        if (req.url === '/__flux__welcome' && req.method === 'GET') {
            ShowFluxWelcomePage(res);
            return;
        }
        if (req.url === '/__flux__up' && req.method === 'GET') {
            ShowFluxUpPage(res);
            return;
        }
        if (req.url === '/__flux__routes' && req.method === 'GET') {
            ShowFluxRoutesPage(this.routes,res);
            return;
        }

        for (const route of this.interpreter.Routes){
            const result = this.matchRoute(req, route);
            if (result) {
                const requestWrapped = this.wrapRequest(req)
                requestWrapped.params = result.params;
                this.executeRoute(route, requestWrapped,res)
                matched = true;
                break;
            }
        }

        if (!matched){
            res.statusCode = 404;
            const response: IResponse = {
                status: 404,
                message: 'Not found'
            }
            res.end(JSON.stringify(response));
        }

    }

    matchRoute(req: http.IncomingMessage, route: IRouteEnv) {
        if (req.method !== route.method) return false;

        const requestPath = new URL(req.url ?? '/', `http://${req.headers.host}`).pathname;

        const routeParts = route.path.split('/').filter(Boolean);
        const pathParts = requestPath.split('/').filter(Boolean);

        if (routeParts.length !== pathParts.length) return false;

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith('#')) continue;
            if (routeParts[i] !== pathParts[i]) return false;
        }
        return {
            params: this.parseRouteParams(route.path, requestPath)
        };
    }

    parseRouteParams(routePath: string, requestPath: string) {
        const params: Record<string, any> = {};
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

    wrapRequest(rawRequest: IncomingMessage, params = {}){
        const reqObj: IFuxRequestNode = {
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

    executeRoute(route: IRouteEnv, req: IFuxRequestNode, res: ServerResponse) {
        try {
            for (const middleware of route.middlewares) {
                this.interpreter.Macros.current_request = req
                const result = evaluateFunctionCall(this.interpreter, middleware)
                if (result === false) return;
            }
            this.interpreter.Macros.current_request = req
            const result = evaluateFunctionCall(this.interpreter, route.handler);

            res.setHeader('Content-Type', 'application/json');
            // TODO: handle response: get, store, etc
            res.end(JSON.stringify({
                status: 200,
                data: result
            }));
        }
        catch (err: any) {
            if (err?.__flux_error_type == 'abort') {
                res.statusCode = err.response.status;
                res.end(JSON.stringify(err.response));
            }
            else {
                res.statusCode = 500;
                const response: IResponse = {
                    status: 500,
                    message: 'Internal Server Error'
                }
                res.end(JSON.stringify(response));
            }
        }
    }

    async listen(): Promise<void> {
        await new Promise<void>((resolve) => {
            this.server.listen(this.port, () => {
                this.showSuccessMessage()
                resolve();
            });
        })
    }

    showSuccessMessage() {

        const line = `${COLORS.Dim}────────────────────────────────────────────${COLORS.Reset}`;

        if (process.env.__FLUX_BROWSER_OPENED__ == 'true') return;


        console.log(this.port)

        console.clear();
        console.log(`${COLORS.Green}🌐  Flux HTTP Server is Running${COLORS.Reset}`);
        console.log(line);
        console.log(`  ➜  ${COLORS.Bright}Local:${COLORS.Reset}        ${COLORS.Cyan}http://localhost:${this.port}${COLORS.Reset}`);
        console.log(`  ➜  ${COLORS.Bright}Project:${COLORS.Reset}      ${COLORS.Magenta}${this.projectJson?.name} v${this.projectJson.version}${COLORS.Reset}`);
        console.log(`  ➜  ${COLORS.Bright}Core:${COLORS.Reset}         ${COLORS.Magenta}flux v${this.coreVersionJson.version}${COLORS.Reset}`);
        console.log(`  ➜  ${COLORS.Bright}Environment:${COLORS.Reset}  ${COLORS.Yellow}development${COLORS.Reset}`);
        console.log(`  ➜  ${COLORS.Bright}Interpreter:${COLORS.Reset}  ${COLORS.Blue}Node.js ${process.version}${COLORS.Reset}`);
        console.log(line);
        console.log(`  ➜  ${COLORS.Bright}Flux Page:${COLORS.Reset}     ${COLORS.Cyan}http://localhost:${this.port}/__flux__routes${COLORS.Reset} ${COLORS.Dim}(routes viewer)${COLORS.Reset}`);
        console.log(`  ➜  ${COLORS.Bright}Flux Page:${COLORS.Reset}     ${COLORS.Cyan}http://localhost:${this.port}/__flux__up${COLORS.Reset}     ${COLORS.Dim}(status page)${COLORS.Reset}`);
        console.log(line);
        console.log(`${COLORS.Dim}Press Ctrl+C to stop the server${COLORS.Reset}\n`);

        // open welcome page
        const url = `http://localhost:${this.port}/__flux__welcome`;
        const startCommands: Record<string, string> = {
            win32: 'start',
            darwin: 'open',
            linux: 'xdg-open'
        };
        const startCommand = startCommands[process.platform];

        if (!startCommand) return;

        exec(`${startCommand} ${url}`, (err) => {
            if (err) {
                FluxErrorHandler.error(`Failed to open browser: ${JSON.stringify(err)}`)
            }
        });
    }
}