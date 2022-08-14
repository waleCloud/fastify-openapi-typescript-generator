import { OpenAPIV3_1, OpenAPIV3 } from 'openapi-types'

export type OpenAPIVX = OpenAPIV3_1.Document | OpenAPIV3.Document

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

export type PathWithOperationId = OpenAPIV3_1.OperationObject &
    Required<Pick<OpenAPIV3_1.OperationObject, 'operationId'>>

export enum RouteTypeTag {
    PathParams = 'PathParams',
    QueryParams = 'QueryParams',
    RequestBody = 'RequestBody',
    ReplyBody = 'ReplyBody',
}

export type AnyObjectType =
    | OpenAPIV3_1.ReferenceObject
    | OpenAPIV3_1.ParameterObject
    | OpenAPIV3_1.SchemaObject
    | OpenAPIV3_1.ResponseObject
    | OpenAPIV3_1.ExampleObject
    | OpenAPIV3_1.RequestBodyObject
    | OpenAPIV3_1.HeaderObject
    | OpenAPIV3_1.SecuritySchemeObject
    | OpenAPIV3_1.LinkObject
    | OpenAPIV3_1.CallbackObject
    | OpenAPIV3_1.PathItemObject
    | OpenAPIV3_1.ArraySchemaObject
