import fs from 'fs'
import path from 'path'
import { generateHandlers } from '../handlers-generator/handlers-generator.js'
import { generateOpenapiTypes } from '../openapi-types/openapi-types.js'
import { handlersFileName, openapiTypesFileName } from '../utils/consts.js'
const { mkdir, writeFile } = fs.promises

export async function generateComponentsFromOpenapi(
    outputFolder: string,
    openapiPath: string,
): Promise<void> {
    await mkdir(outputFolder, { recursive: true })

    const openapiTypesOutputPath = path.join(outputFolder, openapiTypesFileName)
    const openapiTypes = await generateOpenapiTypes(openapiPath)
    await writeFile(openapiTypesOutputPath, openapiTypes)

    const handlersPath = path.join(outputFolder, handlersFileName)
    const handlers = await generateHandlers(openapiPath)
    await writeFile(handlersPath, handlers)
}
