import {ServerResponse} from "node:http";

export const ShowFluxUpPage = (res: ServerResponse) => {

    const variableMapper: Record<string, string> = {
        version: process.env.npm_package_version ?? '0.0.1',
        env: process.env.NODE_ENV || 'development',
        date: new Date().toLocaleTimeString()
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        data: variableMapper
    }));
}