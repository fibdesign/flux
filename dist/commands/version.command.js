"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCommand = void 0;
const COLORS_1 = require("../constants/COLORS");
const versionCommand = () => {
    const { version } = require('../../package.json');
    // ASCII art logo for "FLUX"
    const fluxLogo = [
        `${COLORS_1.COLORS.Green}███████╗${COLORS_1.COLORS.Yellow}██╗     ${COLORS_1.COLORS.Cyan}██╗   ██╗${COLORS_1.COLORS.Magenta}██╗  ██╗`,
        `${COLORS_1.COLORS.Green}██╔════╝${COLORS_1.COLORS.Yellow}██║     ${COLORS_1.COLORS.Cyan}██║   ██║${COLORS_1.COLORS.Magenta}╚██╗██╔╝`,
        `${COLORS_1.COLORS.Green}█████╗  ${COLORS_1.COLORS.Yellow}██║     ${COLORS_1.COLORS.Cyan}██║   ██║${COLORS_1.COLORS.Magenta} ╚███╔╝ `,
        `${COLORS_1.COLORS.Green}██╔══╝  ${COLORS_1.COLORS.Yellow}██║     ${COLORS_1.COLORS.Cyan}██║   ██║${COLORS_1.COLORS.Magenta} ██╔██╗ `,
        `${COLORS_1.COLORS.Green}██║     ${COLORS_1.COLORS.Yellow}███████╗${COLORS_1.COLORS.Cyan}╚██████╔╝${COLORS_1.COLORS.Magenta}██╔╝ ██╗`,
        `${COLORS_1.COLORS.Green}╚═╝     ${COLORS_1.COLORS.Yellow}╚══════╝${COLORS_1.COLORS.Cyan} ╚═════╝ ${COLORS_1.COLORS.Magenta}╚═╝  ╚═╝`
    ].join('\n');
    console.log();
    console.log(fluxLogo);
    console.log();
    console.log(`${COLORS_1.COLORS.Green}🚀 ${COLORS_1.COLORS.Bright}Flux${COLORS_1.COLORS.Reset} version ${COLORS_1.COLORS.Magenta}v${version}${COLORS_1.COLORS.Reset}`);
    console.log(`${COLORS_1.COLORS.Cyan}Ready to build awesome projects with Flux!${COLORS_1.COLORS.Reset}\n`);
};
exports.versionCommand = versionCommand;
//# sourceMappingURL=version.command.js.map