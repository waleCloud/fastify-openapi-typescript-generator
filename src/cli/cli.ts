import { routesOptionsGenerator } from '../commands/generate-routes/generate-routes-options.factory'
import { openapiSchemasGenerator } from '../commands/generate-schemas/generate-schemas.factory'
import { cliCommands } from './commands/commands'
import { CommandsHandler } from './commands/commands.models'

export const runCli = async () => {
    const onGenerateSchemasComand: CommandsHandler['onGenerateSchemasComand'] =
        ({ input, output }) =>
            openapiSchemasGenerator({
                openapi: input,
                outputDirectory: output,
            }).generateSchemas()

    cliCommands({
        onGenerateSchemasComand,
        onGenerateRoutesOptionsComand: ({ input, output }) =>
            routesOptionsGenerator({
                openapi: input,
                outputDirectory: output,
            }).generateRoutesOptions(),
        onGenerateHandlersCommand: () => Promise.resolve(),
    })
}
