import { RouteGenericInterface } from 'fastify/types/route.js'

export type RouteGenericPropertyName = keyof RouteGenericInterface

export type HandlerProperties = {
    operationId: string
    summary?: string
}
