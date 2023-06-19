import fs from 'fs'
import path from 'path'
import { generateHandlers } from '../handlers-generator/handlers-generator.js'
import { generateOpenapiTypes } from '../openapi-types/openapi-types.js'
import { handlersFileName, openapiTypesFileName } from '../utils/consts.js'
const { mkdir, writeFile, stat } = fs.promises

export async function generateComponentsFromOpenapi(
    outputDirectory: string,
    openapiPath: string,
): Promise<void> {
    if (!(await stat(outputDirectory)).isDirectory())
        await mkdir(outputDirectory, { recursive: true })

    const openapiTypesOutputPath = path.join(
        outputDirectory,
        openapiTypesFileName,
    )
    const openapiTypes = await generateOpenapiTypes(openapiPath)
    await writeFile(openapiTypesOutputPath, openapiTypes)

    const handlersPath = path.join(outputDirectory, handlersFileName)
    const handlers = await generateHandlers(openapiPath)
    await writeFile(handlersPath, handlers)
}
