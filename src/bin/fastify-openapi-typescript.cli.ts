#!/usr/bin/env node

import { program } from 'commander'
import path from 'path'
import { generateComponentsFromOpenapi } from '../openapi-generator/openapi-generator.js'

export type DefaultCommandParamaters = {
    input: string
    output: string
    externalTypesImportFrom?: string
}

program
    .name('fastify-openapi-typescript')
    .description('CLI to generate openapi typscript types from openapi')
    .version('1.0.0')
    .requiredOption(
        '-i, --input <value>',
        'OpenAPI specification path, can be both yaml or json (required)',
    )
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .option(
        '--externalTypesImportFrom <value>',
        'External types import from a specific lib (optional)',
    )
    .action(async options => {
        const { input, output, externalTypesImportFrom } =
            options as DefaultCommandParamaters

        const pwd = process.cwd()

        await generateComponentsFromOpenapi(
            path.join(pwd, output),
            path.join(pwd, input),
            externalTypesImportFrom,
        )
    })
    .parse(process.argv)
