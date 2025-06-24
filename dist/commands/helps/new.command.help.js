"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCommandHelp = void 0;
const DEFAULT_HELPS_1 = require("../../constants/DEFAULT_HELPS");
exports.newCommandHelp = {
    description: 'Create new project',
    usage: 'new [project-name] [options]',
    options: [
        { flags: '-h, --help', description: DEFAULT_HELPS_1.DEFAULT_HELPS.HELP }
    ],
};
//# sourceMappingURL=new.command.help.js.map