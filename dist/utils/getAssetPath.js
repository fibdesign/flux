"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetPath = getAssetPath;
const node_path_1 = __importDefault(require("node:path"));
function getAssetPath(relativePath) {
    return process.pkg
        ? node_path_1.default.join(__dirname, relativePath)
        : node_path_1.default.resolve(__dirname, relativePath);
}
//# sourceMappingURL=getAssetPath.js.map