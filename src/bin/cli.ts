#!/usr/bin/env node

import { program } from 'commander'
import path from 'path'
import { generateComponentsFromOpenapi } from '../openapi-generator/openapi-generator.js'

export type DefaultCommandParamaters = {
    input: string
    output: string
}

program
    .name('fastify-openapi-typescript')
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
