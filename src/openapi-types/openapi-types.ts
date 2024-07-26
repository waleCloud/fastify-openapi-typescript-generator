import openapiTS, { OpenAPITSOptions } from 'openapi-typescript'

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

    const openAPITSOptions: OpenAPITSOptions = {}

    if (externalTypesImportFrom) {
        const externalTypesImport = 'openapiTypes'

        openAPITSOptions.transform = (_, options) => {
            if (options.path.startsWith(schemaStartPath)) {
                const typeName = options.path.replace(schemaStartPath, '')

                return `${externalTypesImport}.${typeName}`
            }
            return undefined
        }
        openAPITSOptions.inject = `import * as ${externalTypesImport} from "${externalTypesImportFrom}";`
    }

    return openapiTS(localPath, openAPITSOptions)
}
