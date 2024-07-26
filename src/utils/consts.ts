export const disableLinter = `/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
`
export const handlersFileName = 'handlers.ts'
export const openapiTypesModule = './types'
export const openapiTypesFileName = 'types.ts'

export const fastifyRouteOptionsImports = `
import { RouteOptions, RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, } from 'fastify'

type GenericRouteOptions = RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    {
        Body: any
        Querystring: any
        Params: any
        Headers: any
        Reply: any
    }
>`
