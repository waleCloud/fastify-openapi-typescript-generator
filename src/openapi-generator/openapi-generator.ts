import openapiTS from '@quinck/openapi-typescript'
import fs from 'fs'
import path from 'path'
import { HandlersGenerator } from '../handlers-generator/handlers-generator.js'
import { OpenapiParser } from '../openapi-parser/openapi-parser.js'
import { OpenapiReader } from '../openapi-reader/openapi-reader.js'
import {
    handlersFileName,
    openapiTypesFileName,
    openapiTypesModule,
} from './openapi-generator.consts.js'
const { mkdir, writeFile } = fs.promises

export async function generateComponentsFromOpenapi(
    outputFolder: string,
    openapiPath: string,
): Promise<void> {
    await mkdir(outputFolder, { recursive: true })

    // generate openapi types
    const openapiTypesOutputPath = path.join(outputFolder, openapiTypesFileName)
    const openapiTypes = await generateOpenapiTypes(openapiPath)
    await writeFile(openapiTypesOutputPath, openapiTypes)

    // generate openapi handlers
    const reader = new OpenapiReader()
    const parser = new OpenapiParser()

    const handlersGenerator = new HandlersGenerator(
        reader,
        parser,
        openapiPath,
        openapiTypesModule,
    )

    const handlersPath = path.join(outputFolder, handlersFileName)
    const handlers = handlersGenerator.generateHandlers()
    await writeFile(handlersPath, handlers)
}

const generateOpenapiTypes = (openapiFilePath: string): Promise<string> => {
    const localPath = new URL(openapiFilePath, import.meta.url)

    return openapiTS(localPath)
}
