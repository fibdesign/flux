import {TCommandEntry} from "../types/TCommandEntry";

export const COMMANDS_LIST = [
    {
        name: 'version',
        aliases: ['-v', '--version'],
        description: 'Show language version'
    },
    {
        name: 'serve',
        aliases: ['-s', 'serve'],
        description: 'Serve the application'
    },
    {
        name: 'download',
        aliases: ['download'],
        description: 'Download packages'
    },
    {
        name: 'new',
        aliases: ['new'],
        description: 'Create a new project'
    }
]