import { program } from 'commander'

export type CommandLineArguments = {
    input: string
    output: string
}

export function getCommandLineArguments(): CommandLineArguments {
    return program
        .name('openapi')
        .usage('[options]')
        .requiredOption(
            '-i, --input <value>',
            'OpenAPI specification path, can be both yaml or json (required)',
        )
        .requiredOption('-o, --output <value>', 'Output directory (required)')
        .parse(process.argv)
        .opts<CommandLineArguments>()
}
