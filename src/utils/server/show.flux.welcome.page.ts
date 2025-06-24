import {readFileSync} from "node:fs";
import {getAssetPath} from "../getAssetPath";
import {ServerResponse} from "node:http";

export const ShowFluxWelcomePage = (res: ServerResponse) => {


    const htmlPath = getAssetPath('../../views/welcome.view.html');
    let html = readFileSync(htmlPath, 'utf-8');

    const variableMapper: Record<string, string> = {
        flux_version: process.env.npm_package_version ?? '0.0.1',
        flux_env: process.env.NODE_ENV || 'development',
        flux_date: new Date().toLocaleTimeString()
    }

    Object.keys(variableMapper).forEach(key => {
        html = html.replaceAll(`\$\{${key}}`, variableMapper[key]);
    })

    res.setHeader('Content-Type', 'text/html');
    res.end(html);
}