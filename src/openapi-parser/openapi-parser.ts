import yaml from 'yaml'
import { OpenAPIVX } from '../utils/types'

export class OpenapiParser {
    parseOpeanpi(openapiFileContent: string): OpenAPIVX {
        if (yaml.isDocument(openapiFileContent))
            return yaml.parse(openapiFileContent)
        return JSON.parse(openapiFileContent)
    }
}
