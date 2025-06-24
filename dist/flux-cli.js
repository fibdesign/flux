"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_command_1 = require("./commands/version.command");
const serve_command_1 = require("./commands/serve.command");
const list_command_1 = require("./commands/list.command");
const new_command_1 = require("./commands/new.command");
const input = process.argv.slice(2);
const command = input[0];
const options = input.slice(1);
const commandEntries = [
    {
        aliases: ['-v', '--version'],
        handler: version_command_1.versionCommand,
    },
    {
        aliases: ['-s', 'serve'],
        handler: () => (0, serve_command_1.serveCommand)(options),
    },
    {
        aliases: ['new'],
        handler: () => (0, new_command_1.newCommand)(options),
    },
];
const commandsMap = {};
for (const { aliases, handler } of commandEntries) {
    aliases.forEach(alias => {
        commandsMap[alias] = handler;
    });
}
const run = commandsMap[command] || list_command_1.listCommand;
run();
//# sourceMappingURL=flux-cli.js.map