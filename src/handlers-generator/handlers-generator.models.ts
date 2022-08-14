import { RouteGenericInterface } from 'fastify/types/route'

export type RouteGenericPropertyName = keyof RouteGenericInterface

export type HandlerProperties = {
    operationId: string
    summary?: string
}
