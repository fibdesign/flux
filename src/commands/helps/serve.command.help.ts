import {DEFAULT_HELPS} from "../../constants/DEFAULT_HELPS";
import {IHelpCommand} from "../../types/IHelpCommand";

export const serveCommandHelp:IHelpCommand = {
    description: 'Serve the application on the Flux development server',
    usage: 'serve [options]',
    options: [
        { flags: '--no-watch', description: 'Disable watching files for changes' },
        { flags: '-h, --help', description: DEFAULT_HELPS.HELP }
    ],
};
