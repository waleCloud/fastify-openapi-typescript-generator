import { Command, program } from 'commander'
import { CommandName, CommandsHandler } from './commands.models'

const withDefaults = (program: Command): Command =>
    program
        .requiredOption(
            '-i, --input <value>',
            'OpenAPI specification path, can be both yaml or json (required)',
        )
        .requiredOption('-o, --output <value>', 'Output directory (required)')

export function cliCommands(handler: CommandsHandler): void {
    program
        .name('openapi-first')
        .description('CLI to generate code from openapi')
        .version('1.0.0')

    withDefaults(program.command(CommandName.GENERATE_SCHEMAS)).action(
        options => handler.onGenerateHandlersCommand(options),
    )

    withDefaults(program.command(CommandName.GENERATE_ROUTES_OPTIONS)).action(
        options => handler.onGenerateRoutesOptionsComand(options),
    )

    withDefaults(program.command(CommandName.GENERATE_HANDLERS)).action(
        options => handler.onGenerateHandlersCommand(options),
    )

    program.parse(process.argv)
}
