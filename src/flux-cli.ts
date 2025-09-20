import {versionCommand} from "./commands/version.command";
import {COLORS} from "./constants/COLORS";
import {TCommandEntry} from "./types/TCommandEntry";
import {TVoidFunction} from "./types/TVoidFunction";
import {serveCommand} from "./commands/serve.command";
import {listCommand} from "./commands/list.command";
import {newCommand} from "./commands/new.command";
import {migrateCommand} from "./commands/migrate.command";

const input = process.argv.slice(2);
const command = input[0];
const options = input.slice(1);

const commandEntries: TCommandEntry[] = [
    {
        aliases: ['-v', '--version'],
        handler: versionCommand,
    },
    {
        aliases: ['-s', 'serve'],
        handler: () => serveCommand(options),
    },
    {
        aliases: ['new'],
        handler: () => newCommand(options),
    },
    {
        aliases: ['migrate'],
        handler: () => migrateCommand(options),
    },
];

const commandsMap: Record<string, TVoidFunction> = {};

for (const { aliases, handler } of commandEntries) {
    aliases.forEach(alias => {
        commandsMap[alias] = handler;
    });
}

const run = commandsMap[command] || listCommand;

run()