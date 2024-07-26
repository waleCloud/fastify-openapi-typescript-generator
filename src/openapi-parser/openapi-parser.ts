import yaml from 'yaml'
import { OpenAPIVX } from '../utils/types.js'

export class OpenapiParser {
    parseOpeanpi(openapiFileContent: string): OpenAPIVX {
        try {
            return JSON.parse(openapiFileContent)
        } catch {
            return yaml.parse(openapiFileContent)
        }
    }
}
