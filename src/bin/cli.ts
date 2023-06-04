#!/usr/bin/env node

import { program } from 'commander'
import path from 'path'
import { DefaultCommandParamaters } from '../cli/commands/commands.models.js'
import { generateComponentsFromOpenapi } from '../openapi-generator/openapi-generator.js'

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
        const pwd = process.env.PWD
        await generateComponentsFromOpenapi(
            path.join(pwd, output),
            path.join(pwd, input),
        )
    })
    .parse(process.argv)
