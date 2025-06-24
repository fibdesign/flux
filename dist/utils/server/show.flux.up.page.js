"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowFluxUpPage = void 0;
const ShowFluxUpPage = (res) => {
    const variableMapper = {
        version: process.env.npm_package_version ?? '0.0.1',
        env: process.env.NODE_ENV || 'development',
        date: new Date().toLocaleTimeString()
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        data: variableMapper
    }));
};
exports.ShowFluxUpPage = ShowFluxUpPage;
//# sourceMappingURL=show.flux.up.page.js.map