import {COLORS} from "../constants/COLORS";

export const versionCommand = (): void =>  {
    const { version } = require('../../package.json');

    // ASCII art logo for "FLUX"
    const fluxLogo = [
        `${COLORS.Green}███████╗${COLORS.Yellow}██╗     ${COLORS.Cyan}██╗   ██╗${COLORS.Magenta}██╗  ██╗`,
        `${COLORS.Green}██╔════╝${COLORS.Yellow}██║     ${COLORS.Cyan}██║   ██║${COLORS.Magenta}╚██╗██╔╝`,
        `${COLORS.Green}█████╗  ${COLORS.Yellow}██║     ${COLORS.Cyan}██║   ██║${COLORS.Magenta} ╚███╔╝ `,
        `${COLORS.Green}██╔══╝  ${COLORS.Yellow}██║     ${COLORS.Cyan}██║   ██║${COLORS.Magenta} ██╔██╗ `,
        `${COLORS.Green}██║     ${COLORS.Yellow}███████╗${COLORS.Cyan}╚██████╔╝${COLORS.Magenta}██╔╝ ██╗`,
        `${COLORS.Green}╚═╝     ${COLORS.Yellow}╚══════╝${COLORS.Cyan} ╚═════╝ ${COLORS.Magenta}╚═╝  ╚═╝`
    ].join('\n');

    console.log();
    console.log(fluxLogo);
    console.log();
    console.log(`${COLORS.Green}🚀 ${COLORS.Bright}Flux${COLORS.Reset} version ${COLORS.Magenta}v${version}${COLORS.Reset}`);
    console.log(`${COLORS.Cyan}Ready to build awesome projects with Flux!${COLORS.Reset}\n`);
}