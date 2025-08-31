import openapiTS, { OpenAPITSOptions } from 'openapi-typescript'
import { disableLinter } from '../utils/consts.js'

export type OpenapiTypesOptions = {
    externalTypesImportFrom?: string
}

const schemaStartPath = '#/components/schemas/'

export const generateOpenapiTypes = (
    openapiFilePath: string,
    options?: OpenapiTypesOptions,
): Promise<string> => {
    const localPath = new URL(openapiFilePath, import.meta.url)

    const { externalTypesImportFrom } = options ?? {}

    const openAPITSOptions: OpenAPITSOptions = {
        inject: disableLinter,
    }

    if (externalTypesImportFrom) {
        const externalTypesImport = 'openapiTypes'

        openAPITSOptions.transform = (_, options) => {
            if (options.path.startsWith(schemaStartPath)) {
                const typeName = options.path.replace(schemaStartPath, '')

                return `${externalTypesImport}.${typeName}`
            }
            return undefined
        }
        openAPITSOptions.inject += `\nimport * as ${externalTypesImport} from "${externalTypesImportFrom}";\n`
    }

    return openapiTS(localPath, openAPITSOptions)
}
