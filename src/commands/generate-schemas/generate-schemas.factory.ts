import { openapiTypescriptCodegen } from './generate-schemas-openapi-typescript-codegen.js'
import { SchemasGeneratorFactory } from './generate-schemas.models.js'

export const openapiSchemasGenerator: SchemasGeneratorFactory =
    openapiTypescriptCodegen
