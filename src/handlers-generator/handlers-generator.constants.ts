import { OpenAPIV3 } from 'openapi-types'

export const openapiOperationsImportName = 'operations'

export const methods = Object.values(OpenAPIV3.HttpMethods)

export const openapiOperationsImport = (module: string) =>
    `import { ${openapiOperationsImportName} } from '${module}'`

export const fastifyImports = `
import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteHandlerMethod,
} from "fastify"
`

export const utilityTypesDefinition = `
type ValueOf<T> = T[keyof T]

type Params<Operation extends keyof ${openapiOperationsImportName}> =
    ${openapiOperationsImportName}[Operation] extends { parameters: { path?: unknown } }
        ? ${openapiOperationsImportName}[Operation]['parameters']['path']
        : unknown

type Querystring<Operation extends keyof ${openapiOperationsImportName}> =
    ${openapiOperationsImportName}[Operation] extends { parameters: { query?: unknown } }
        ? ${openapiOperationsImportName}[Operation]['parameters']['query']
        : unknown

type Headers<Operation extends keyof ${openapiOperationsImportName}> =
    ${openapiOperationsImportName}[Operation] extends { parameters: { header?: unknown } }
        ? ${openapiOperationsImportName}[Operation]['parameters']['header']
        : unknown

type Body<Operation extends keyof ${openapiOperationsImportName}> =
    ${openapiOperationsImportName}[Operation] extends { requestBody?: { content: { 'application/json': unknown } } }
        ? ${openapiOperationsImportName}[Operation]['requestBody']['content']['application/json']
        : unknown

type Reply<Operation extends keyof ${openapiOperationsImportName}> =
    ${openapiOperationsImportName}[Operation] extends { responses: Record<string | number | symbol, { content: { 'application/json': unknown } } > }
    ? ValueOf<operations[Operation]['responses']>['content']['application/json']
    : unknown

`

export const handlersInterfacePrefix = 'export interface Handlers {'
export const handlersInterfacePostfix = '}'
