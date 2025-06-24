import path from "node:path";

export function getAssetPath(relativePath: string) {

    return process.pkg
        ? path.join(__dirname, relativePath)
        : path.resolve(__dirname, relativePath)
}
