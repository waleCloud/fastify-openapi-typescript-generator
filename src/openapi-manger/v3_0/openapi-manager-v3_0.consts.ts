import { OpenAPIV3 } from 'openapi-types'

export const defaultObject: OpenAPIV3.SchemaObject = {
    type: 'object',
    additionalProperties: false,
}

export const nullObject: OpenAPIV3.SchemaObject = {
    type: 'object',
    nullable: true,
}
