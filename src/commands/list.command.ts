import {COLORS} from "../constants/COLORS";
import {COMMANDS_LIST} from "../constants/COMMANDS_LIST";
import {DEFAULT_HELPS} from "../constants/DEFAULT_HELPS";


export const listCommand = () => {
    console.log(`${COLORS.Yellow}Usage:${COLORS.Reset}`);
    console.log('   command [options]');

    console.log('')
    console.log(`${COLORS.Yellow}Options:${COLORS.Reset}`);
    console.log(`${COLORS.Green}   -h, --help${COLORS.Reset}`.padEnd(30),DEFAULT_HELPS.HELP);

    console.log('')
    console.log(`${COLORS.Yellow}Available commands:${COLORS.Reset}`);

    for (const cmd of COMMANDS_LIST) {
        const aliases = cmd.aliases.map(a => `${a}`).join(', ');
        console.log(`${COLORS.Green}   ${aliases.padEnd(20)}${COLORS.Reset} ${cmd.description}`);
    }

    console.log('');
}