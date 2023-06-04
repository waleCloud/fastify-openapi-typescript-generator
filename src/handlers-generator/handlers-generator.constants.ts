import { RouteTypeTag } from '../utils/types.js'

export const openapiOperationsImportName = 'operations'

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

export const valueOfType = 'type ValueOf<T> = T[keyof T]'

export const handlersInterfacePrefix = 'export interface Handlers {'
export const handlersInterfacePostfix = '}'

export const routeTypeTags = Object.values(RouteTypeTag)
