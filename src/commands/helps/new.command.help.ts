import {IHelpCommand} from "../../types/IHelpCommand";
import {DEFAULT_HELPS} from "../../constants/DEFAULT_HELPS";

export const newCommandHelp:IHelpCommand = {
    description: 'Create new project',
    usage: 'new [project-name] [options]',
    options: [
        { flags: '-h, --help', description: DEFAULT_HELPS.HELP }
    ],
};
