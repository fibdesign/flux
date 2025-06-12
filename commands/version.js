module.exports = function versionCommand() {
    const { version, name } = require('../package.json');

    const Reset = '\x1b[0m';
    const Bright = '\x1b[1m';
    const Cyan = '\x1b[36m';
    const Magenta = '\x1b[35m';
    const Green = '\x1b[32m';
    const Yellow = '\x1b[33m';
    const Blue = '\x1b[34m';

    // ASCII art logo for "FLUX"
    const fluxLogo = [
        `${Green}███████╗${Yellow}██╗     ${Cyan}██╗   ██╗${Magenta}██╗  ██╗`,
        `${Green}██╔════╝${Yellow}██║     ${Cyan}██║   ██║${Magenta}╚██╗██╔╝`,
        `${Green}█████╗  ${Yellow}██║     ${Cyan}██║   ██║${Magenta} ╚███╔╝ `,
        `${Green}██╔══╝  ${Yellow}██║     ${Cyan}██║   ██║${Magenta} ██╔██╗ `,
        `${Green}██║     ${Yellow}███████╗${Cyan}╚██████╔╝${Magenta}██╔╝ ██╗`,
        `${Green}╚═╝     ${Yellow}╚══════╝${Cyan} ╚═════╝ ${Magenta}╚═╝  ╚═╝`
    ].join('\n');

    console.log();
    console.log(fluxLogo);
    console.log();
    console.log(`${Green}🚀 ${Bright}Flux${Reset} version ${Magenta}v${version}${Reset}`);
    console.log(`${Cyan}Ready to build awesome projects with Flux!${Reset}\n`);
};