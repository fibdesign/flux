"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowFluxWelcomePage = void 0;
const node_fs_1 = require("node:fs");
const getAssetPath_1 = require("../getAssetPath");
const ShowFluxWelcomePage = (res) => {
    const htmlPath = (0, getAssetPath_1.getAssetPath)('../../views/welcome.view.html');
    let html = (0, node_fs_1.readFileSync)(htmlPath, 'utf-8');
    const variableMapper = {
        flux_version: process.env.npm_package_version ?? '0.0.1',
        flux_env: process.env.NODE_ENV || 'development',
        flux_date: new Date().toLocaleTimeString()
    };
    Object.keys(variableMapper).forEach(key => {
        html = html.replaceAll(`\$\{${key}}`, variableMapper[key]);
    });
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
};
exports.ShowFluxWelcomePage = ShowFluxWelcomePage;
//# sourceMappingURL=show.flux.welcome.page.js.map