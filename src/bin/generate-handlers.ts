#!/usr/bin/env node

import { getEnvironment } from '../configs/environment'
import { getCommandLineArguments } from '../configs/arguments'
import { generateComponentsFromOpenapi } from '../openapi-generator/openapi-generator'

async function generate(): Promise<void> {
    const rootDir = getEnvironment().PWD

    const { input, output } = getCommandLineArguments()

    await generateComponentsFromOpenapi({
        rootDir,
        openapiFileRelativePath: input,
        destinationFolderRelativePath: output,
    })
}

generate()
    .then(() => {
        process.exit(0)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
