import { OpenAPIVX } from './../utils/types'

export interface OpenapiManager<OpenApiType extends OpenAPIVX> {
    generateOpenapiWithRoutesSchemas(openapi: OpenApiType): OpenApiType
}
