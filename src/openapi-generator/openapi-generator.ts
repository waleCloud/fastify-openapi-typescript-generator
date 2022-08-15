import fs from 'fs'
import path from 'path'
import { HandlersGenerator } from '../handlers-generator/handlers-generator'
import { OpenapiParser } from '../openapi-parser/openapi-parser'
import { OpenapiReader } from '../openapi-reader/openapi-reader'
import { OpenApiVersionVerifier } from '../openapi-version-verifier/openapi-version-verifier'
import { RoutesSchemasGenerator } from '../routes-schemas-generator/routes-schemas-generator'
import { SchemasGenerator } from '../schemas-generator/schemas-generator'
import { handlersFileName } from './openapi-generator.consts'

export type GenerateComponentsFromOpenapiParams = {
    rootDir: string
    openapiFileRelativePath: string
    destinationFolderRelativePath: string
}

export async function generateComponentsFromOpenapi({
    rootDir,
    openapiFileRelativePath,
    destinationFolderRelativePath,
}: GenerateComponentsFromOpenapiParams): Promise<void> {
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

    const handlersPath = path.join(basFolder, handlersFileName)
    const handlers = handlersGenerator.generateHandlers()
    fs.writeFileSync(handlersPath, handlers)
}
