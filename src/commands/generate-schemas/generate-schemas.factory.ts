import { openapiTypescriptCodegen } from './generate-schemas-openapi-typescript-codegen'
import { SchemasGeneratorFactory } from './generate-schemas.models'

export const openapiSchemasGenerator: SchemasGeneratorFactory =
    openapiTypescriptCodegen
