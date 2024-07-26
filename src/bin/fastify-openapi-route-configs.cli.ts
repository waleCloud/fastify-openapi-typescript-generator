#!/usr/bin/env node

import { program } from 'commander'
import path from 'path'
import { routesOptionsGenerator } from '../generate-routes/generate-routes-options.factory.js'

export type DefaultCommandParamaters = {
    input: string
    output: string
}

program
    .name('fastify-openapi-route-configs')
    .description('CLI to generate route configs from openapi')
    .version('1.0.0')
    .requiredOption(
        '-i, --input <value>',
        'OpenAPI specification path, can be both yaml or json (required)',
    )
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .action(async options => {
        const { input, output } = options as DefaultCommandParamaters
        const pwd = process.cwd()
        await routesOptionsGenerator({
            openapi: path.join(pwd, input),
            outputDirectory: path.join(pwd, output),
        }).generateRoutesOptions()
    })
    .parse(process.argv)
