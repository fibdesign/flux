import {IHelpCommand} from "../types/IHelpCommand";
import {COLORS} from "../constants/COLORS";

export const HelpCommandDisplay = (help: IHelpCommand) => {
    console.log(`${COLORS.Yellow}Description:${COLORS.Reset}`);
    console.log(`   ${help.description}`);

    console.log('')
    console.log(`${COLORS.Yellow}Usage:${COLORS.Reset}`);
    console.log(`   ${help.usage}`);

    console.log('')
    console.log(`${COLORS.Yellow}Options:${COLORS.Reset}`);

    for (const cmd of help.options) {
        console.log(`${COLORS.Green}   ${cmd.flags.padEnd(20)}${COLORS.Reset} ${cmd.description}`);
    }

    console.log('');

}