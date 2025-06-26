import {ServerResponse} from "node:http";
import {IResponse} from "../../types/IResponse";
import path from "node:path";
import {readFileSync} from "node:fs";

export const ShowFluxUpPage = (res: ServerResponse) => {

    const projectRoot = process.env.FLUX_PROJECT_ROOT || path.resolve('.');
    const FILE_PATH = 'flux.json';
    const filePath = path.resolve(projectRoot, FILE_PATH);
    const fluxString = readFileSync(filePath, 'utf-8');
    const fluxJson = JSON.parse(fluxString);

    const variableMapper: Record<string, string> = {
        version: fluxJson?.version ?? '0.0.1',
        env: process.env.NODE_ENV || 'development',
        date: new Date().toLocaleTimeString()
    }

    const response: IResponse = {
        status: 200,
        message: 'Server is up and running...',
        data: variableMapper
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}