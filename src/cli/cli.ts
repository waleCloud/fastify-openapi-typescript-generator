import { cliCommands } from './commands/commands'

export const runCli = async () => {
    cliCommands({
        onGenerateSchemasComand: () => Promise.resolve(),
        onGenerateHandlersCommand: () => Promise.resolve(),
    })
}
