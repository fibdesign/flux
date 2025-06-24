"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowFluxRoutesPage = void 0;
const getAssetPath_1 = require("../getAssetPath");
const node_fs_1 = require("node:fs");
const AST_TYPES_1 = require("../../constants/AST_TYPES");
const ShowFluxRoutesPage = (routes, res) => {
    const routesHtmlTemplatePath = (0, getAssetPath_1.getAssetPath)('../../views/routes.view.html');
    let routesHtmlTemplate = (0, node_fs_1.readFileSync)(routesHtmlTemplatePath, 'utf-8');
    const versions = ['All'];
    let routesHtml = '';
    if (routes.length == 0) {
        routesHtml = `<tr><td colspan="6" class="empty">No routes defined</td></tr>`;
    }
    else {
        routes.sort((a, b) => a.path.localeCompare(b.path));
        routes.forEach(route => {
            const handler = route.handler.expression.type === AST_TYPES_1.AST_TYPES.IDENTIFIER ? route.handler.expression.value.value : '';
            const routesVariableMapper = {
                route_method: route.method.toUpperCase(),
                route_path: route.path,
                route_middlewares: route.middlewares
                    .map((middleware) => {
                    return middleware.expression.type === AST_TYPES_1.AST_TYPES.IDENTIFIER ? middleware.expression.value.value : '';
                })
                    .join(', ') || `<span style="opacity:0.5">None</span>`,
                route_handler: handler,
                route_version: route?.version || 'v1',
                route_flag: route?.flag || '-'
            };
            let newHtml = routesHtmlTemplate;
            Object.keys(routesVariableMapper).forEach(key => {
                newHtml = newHtml.replaceAll(`\$\{${key}}`, routesVariableMapper[key]);
            });
            routesHtml += newHtml;
            if (!versions.includes(routesVariableMapper.route_version)) {
                versions.push(routesVariableMapper.route_version);
            }
        });
    }
    let versionsHtml = '';
    versions.forEach(version => {
        versionsHtml += `<option value="${version}">${version}</option>`;
    });
    const routerVariableMapper = {
        router_view: routesHtml,
        total_routes: routes.length.toString(),
        flux_date: new Date().toLocaleTimeString(),
        versions: versionsHtml,
    };
    const routerHtmlPath = (0, getAssetPath_1.getAssetPath)('../../views/router.view.html');
    let routerHtml = (0, node_fs_1.readFileSync)(routerHtmlPath, 'utf-8');
    Object.keys(routerVariableMapper).forEach(key => {
        routerHtml = routerHtml.replaceAll(`\$\{${key}}`, routerVariableMapper[key]);
    });
    res.setHeader('Content-Type', 'text/html');
    res.end(routerHtml);
};
exports.ShowFluxRoutesPage = ShowFluxRoutesPage;
//# sourceMappingURL=show.flux.routes.page.js.map