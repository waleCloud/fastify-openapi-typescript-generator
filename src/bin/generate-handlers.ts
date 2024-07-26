#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import { HandlersGenerator } from '../handlers-generator/handlers-generator'
import { OpenapiParser } from '../openapi-parser/openapi-parser'
import { OpenapiReader } from '../openapi-reader/openapi-reader'
import { OpenApiVersionVerifier } from '../openapi-version-verifier/openapi-version-verifier'
import { RoutesSchemasGenerator } from '../routes-schemas-generator/routes-schemas-generator'
import { SchemasGenerator } from '../schemas-generator/schemas-generator'

async function generate(): Promise<void> {
    const rootDir = process.env.PWD || ''

    const [openapiFileRelativePath, destinationFolderRelativePath] =
        process.argv.slice(2)

    const basFolder = path.join(rootDir, destinationFolderRelativePath)

    const openapiPath = path.join(rootDir, openapiFileRelativePath)
    const reader = new OpenapiReader()
    const parser = new OpenapiParser()
    const versionVerifier = new OpenApiVersionVerifier()
    const routesSchemasGenerator = new RoutesSchemasGenerator(
        reader,
        parser,
        versionVerifier,
        openapiPath,
    )
    const openapiWithRoutesSchemas =
        routesSchemasGenerator.generateRoutesSchemas()

    await new SchemasGenerator(
        openapiWithRoutesSchemas,
        basFolder,
    ).generateSchemas()

    const handlersGenerator = new HandlersGenerator(reader, parser, openapiPath)

    const handlersPath = path.join(basFolder, 'handlers.ts')
    const handlers = handlersGenerator.generateHandlers()
    fs.writeFileSync(handlersPath, handlers)
}

generate()
