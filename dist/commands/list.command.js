"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = void 0;
const COLORS_1 = require("../constants/COLORS");
const COMMANDS_LIST_1 = require("../constants/COMMANDS_LIST");
const DEFAULT_HELPS_1 = require("../constants/DEFAULT_HELPS");
const listCommand = () => {
    console.log(`${COLORS_1.COLORS.Yellow}Usage:${COLORS_1.COLORS.Reset}`);
    console.log('   command [options]');
    console.log('');
    console.log(`${COLORS_1.COLORS.Yellow}Options:${COLORS_1.COLORS.Reset}`);
    console.log(`${COLORS_1.COLORS.Green}   -h, --help${COLORS_1.COLORS.Reset}`.padEnd(30), DEFAULT_HELPS_1.DEFAULT_HELPS.HELP);
    console.log('');
    console.log(`${COLORS_1.COLORS.Yellow}Available commands:${COLORS_1.COLORS.Reset}`);
    for (const cmd of COMMANDS_LIST_1.COMMANDS_LIST) {
        const aliases = cmd.aliases.map(a => `${a}`).join(', ');
        console.log(`${COLORS_1.COLORS.Green}   ${aliases.padEnd(20)}${COLORS_1.COLORS.Reset} ${cmd.description}`);
    }
    console.log('');
};
exports.listCommand = listCommand;
//# sourceMappingURL=list.command.js.map