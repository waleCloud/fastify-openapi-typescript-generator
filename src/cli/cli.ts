import { program } from 'commander'
import { generateComponentsFromOpenapi } from '../openapi-generator/openapi-generator.js'
import { DefaultCommandParamaters } from './commands/commands.models.js'

export const runCli = async () => {
    program
        .name('openapi-first')
        .description('CLI to generate code from openapi')
        .version('1.0.0')
        .requiredOption(
            '-i, --input <value>',
            'OpenAPI specification path, can be both yaml or json (required)',
        )
        .requiredOption('-o, --output <value>', 'Output directory (required)')
        .action(async options => {
            const { input, output } = options as DefaultCommandParamaters
            await generateComponentsFromOpenapi(output, input)
        })
}
