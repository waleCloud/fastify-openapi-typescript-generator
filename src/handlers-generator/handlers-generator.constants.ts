import { RouteTypeTag } from '../utils/types'

export const disableLinter = `/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
`

export const openapiSchemasImportName = 'openapi'

export const openapiSchemasImport = `import * as ${openapiSchemasImportName} from './index'`

export const fastifyImports = `
import {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteHandlerMethod,
} from "fastify"
`

export const handlersInterfacePrefix = 'export interface Handlers {'
export const handlersInterfacePostfix = '}'

export const routeTypeTags = Object.values(RouteTypeTag)
