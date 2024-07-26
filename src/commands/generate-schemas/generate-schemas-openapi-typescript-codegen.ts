import { generate } from 'openapi-typescript-codegen'
import {
    SchemasGenerator,
    SchemasGeneratorFactory,
} from './generate-schemas.models.js'

export const openapiTypescriptCodegen: SchemasGeneratorFactory = ({
    openapi,
    outputDirectory,
}) => {
    const generateSchemas: SchemasGenerator['generateSchemas'] = () =>
        generate({
            input: openapi,
            output: outputDirectory,
            exportCore: false,
            exportServices: false,
            exportSchemas: false,
        })

    return {
        generateSchemas,
    }
}
