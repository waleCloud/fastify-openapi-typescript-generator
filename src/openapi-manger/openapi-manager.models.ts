import { OpenAPIVX } from './../utils/types.js'

export interface OpenapiManager<OpenApiType extends OpenAPIVX> {
    generateOpenapiWithRoutesSchemas(openapi: OpenApiType): OpenApiType
}
