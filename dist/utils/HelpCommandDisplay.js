"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCommandDisplay = void 0;
const COLORS_1 = require("../constants/COLORS");
const HelpCommandDisplay = (help) => {
    console.log(`${COLORS_1.COLORS.Yellow}Description:${COLORS_1.COLORS.Reset}`);
    console.log(`   ${help.description}`);
    console.log('');
    console.log(`${COLORS_1.COLORS.Yellow}Usage:${COLORS_1.COLORS.Reset}`);
    console.log(`   ${help.usage}`);
    console.log('');
    console.log(`${COLORS_1.COLORS.Yellow}Options:${COLORS_1.COLORS.Reset}`);
    for (const cmd of help.options) {
        console.log(`${COLORS_1.COLORS.Green}   ${cmd.flags.padEnd(20)}${COLORS_1.COLORS.Reset} ${cmd.description}`);
    }
    console.log('');
};
exports.HelpCommandDisplay = HelpCommandDisplay;
//# sourceMappingURL=HelpCommandDisplay.js.map