import fs from 'fs'
import path from 'path'
import { generateHandlers } from '../handlers-generator/handlers-generator.js'
import { generateOpenapiTypes } from '../openapi-types/openapi-types.js'
import { handlersFileName, openapiTypesFileName } from '../utils/consts.js'
import { mkdirIfNotExists } from '../utils/fs.js'
const { writeFile } = fs.promises

export async function generateComponentsFromOpenapi(
    outputDirectory: string,
    openapiPath: string,
    externalTypesImportFrom?: string,
): Promise<void> {
    await mkdirIfNotExists(outputDirectory)

    const openapiTypesOutputPath = path.join(
        outputDirectory,
        openapiTypesFileName,
    )
    const openapiTypes = await generateOpenapiTypes(openapiPath, {
        externalTypesImportFrom,
    })
    await writeFile(openapiTypesOutputPath, openapiTypes)

    const handlersPath = path.join(outputDirectory, handlersFileName)
    const handlers = await generateHandlers(openapiPath)
    await writeFile(handlersPath, handlers)
}
