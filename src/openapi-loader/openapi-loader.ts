import fs from 'fs'
import yaml from 'yaml'
import { OpenAPIVX } from '../utils/types.js'
const { readFile } = fs.promises

export async function loadOpenapi(openapiFilePath: string): Promise<OpenAPIVX> {
    const openapiFileContent = await readFile(openapiFilePath, 'utf-8')
    try {
        return JSON.parse(openapiFileContent)
    } catch {
        return yaml.parse(openapiFileContent)
    }
}
