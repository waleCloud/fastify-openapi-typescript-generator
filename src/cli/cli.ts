#!/usr/bin/env node

import { cliCommands } from './commands/commands'

async function runCli(): Promise<void> {
    cliCommands({
        onGenerateSchemasComand: () => Promise.resolve(),
        onGenerateHandlersCommand: () => Promise.resolve(),
    })
}

runCli()
    .then(() => {
        process.exit(0)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
