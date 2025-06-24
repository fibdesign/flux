import {getAssetPath} from "../getAssetPath";
import {readFileSync} from "node:fs";
import {IRouteEnv} from "../../types/TFluxAST";
import {AST_TYPES} from "../../constants/AST_TYPES";
import {ServerResponse} from "node:http";

export const ShowFluxRoutesPage = (routes:IRouteEnv[],res: ServerResponse) => {

    const routesHtmlTemplatePath = getAssetPath('../../views/routes.view.html');
    let routesHtmlTemplate = readFileSync(routesHtmlTemplatePath, 'utf-8');

    const versions:string[] = ['All']

    let routesHtml = '';

    if (routes.length == 0){
        routesHtml = `<tr><td colspan="6" class="empty">No routes defined</td></tr>`
    }else{
        routes.sort((a, b) => a.path.localeCompare(b.path));
        routes.forEach(route => {
            const handler = route.handler.expression.type === AST_TYPES.IDENTIFIER ? route.handler.expression.value.value : ''
            const routesVariableMapper: Record<string, string> = {
                route_method: route.method.toUpperCase(),
                route_path: route.path,
                route_middlewares: route.middlewares
                    .map((middleware):string => {
                        return middleware.expression.type === AST_TYPES.IDENTIFIER ? middleware.expression.value.value : ''
                    })
                    .join(', ') || `<span style="opacity:0.5">None</span>`,
                route_handler: handler,
                route_version: route?.version || 'v1',
                route_flag: route?.flag || '-'
            }
            let newHtml = routesHtmlTemplate;
            Object.keys(routesVariableMapper).forEach(key => {
                newHtml = newHtml.replaceAll(`\$\{${key}}`, routesVariableMapper[key]);
            })
            routesHtml += newHtml;

            if (!versions.includes(routesVariableMapper.route_version)){
                versions.push(routesVariableMapper.route_version);
            }
        })
    }

    let versionsHtml = '';

    versions.forEach(version => {
        versionsHtml += `<option value="${version}">${version}</option>`;
    })

    const routerVariableMapper: Record<string, string> = {
        router_view: routesHtml,
        total_routes: routes.length.toString(),
        flux_date: new Date().toLocaleTimeString(),
        versions: versionsHtml,
    }
    const routerHtmlPath = getAssetPath('../../views/router.view.html');
    let routerHtml = readFileSync(routerHtmlPath, 'utf-8');

    Object.keys(routerVariableMapper).forEach(key => {
        routerHtml = routerHtml.replaceAll(`\$\{${key}}`, routerVariableMapper[key]);
    })

    res.setHeader('Content-Type', 'text/html');
    res.end(routerHtml);
}