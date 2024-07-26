import { OpenAPIV3_1 } from 'openapi-types'

export const defaultObject: OpenAPIV3_1.SchemaObject = {
    type: 'object',
    additionalProperties: false,
}

export const nullObject: OpenAPIV3_1.SchemaObject = {
    type: 'null',
}
