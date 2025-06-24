"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveCommandHelp = void 0;
const DEFAULT_HELPS_1 = require("../../constants/DEFAULT_HELPS");
exports.serveCommandHelp = {
    description: 'Serve the application on the Flux development server',
    usage: 'serve [options]',
    options: [
        { flags: '--no-watch', description: 'Disable watching files for changes' },
        { flags: '-h, --help', description: DEFAULT_HELPS_1.DEFAULT_HELPS.HELP }
    ],
};
//# sourceMappingURL=serve.command.help.js.map