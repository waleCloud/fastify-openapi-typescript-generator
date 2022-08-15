import { OpenapiParser } from '../openapi-parser/openapi-parser'
import { OpenapiReader } from '../openapi-reader/openapi-reader'
import { OpenAPIVX, RouteTypeTag } from '../utils/types'
import { methods } from '../utils/openapi'
import {
    HandlerProperties,
    RouteGenericPropertyName,
} from './handlers-generator.models'
import {
    disableLinter,
    fastifyImports,
    openapiSchemasImport,
    handlersInterfacePrefix,
    handlersInterfacePostfix,
    routeTypeTags,
    openapiSchemasImportName,
} from './handlers-generator.constants'

export class HandlersGenerator {
    constructor(
        private readonly openapiReader: OpenapiReader,
        private readonly openapiParser: OpenapiParser,
        private readonly openapiFilePath: string,
    ) {}

    generateHandlers(): string {
        const openapiRaw = this.openapiReader.readOpenapi(this.openapiFilePath)
        const openapi = this.openapiParser.parseOpeanpi(openapiRaw)

        const handlersProperties = this.getHandlersProperties(openapi)

        const operations = handlersProperties.map(
            ({ operationId, summary }) => {
                const routeString = this.getRouteGenericString(operationId)
                const handler = `${operationId}?: ${routeString}`
                const documentation = this.createDocumentation(summary)
                return `${documentation}\n\t${handler}`
            },
        )
        return this.formatHandlers(operations)
    }

    private createDocumentation(summary?: string): string {
        if (
            summary != undefined &&
            summary != null &&
            typeof summary == 'string'
        )
            return `
    /**
     * ${summary}
     */`

        return ''
    }

    private getRouteGenericProp(
        routeComponentType: RouteTypeTag,
    ): RouteGenericPropertyName {
        switch (routeComponentType) {
            case RouteTypeTag.PathParams:
                return 'Params'
            case RouteTypeTag.QueryParams:
                return 'Querystring'
            case RouteTypeTag.RequestBody:
                return 'Body'
            case RouteTypeTag.ReplyBody:
                return 'Reply'
        }
    }

    private getRouteGeneric(operationId: string): string {
        const routeGenricDefinition = routeTypeTags
            .map(tag => this.getRouteGenricDefinition(tag, operationId))
            .join('\n')
        return `{
${routeGenricDefinition}
    }`
    }

    private getRouteGenricDefinition(
        tag: RouteTypeTag,
        operationId: string,
    ): string {
        const routeProp = this.getRouteGenericProp(tag)
        return `\t\t\t${routeProp}: ${openapiSchemasImportName}.${operationId}${tag}`
    }

    private getRouteGenericString(operationId: string): string {
        return `RouteHandlerMethod<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    ${this.getRouteGeneric(operationId)}
  >`
    }

    private getHandlersProperties(openapi: OpenAPIVX): HandlerProperties[] {
        if (openapi.paths === undefined) return []

        return Object.values(openapi.paths).flatMap(path =>
            methods.flatMap(method => {
                if (path != undefined) {
                    if (method in path) {
                        const operation = path[method]
                        if (operation) {
                            const { operationId, summary } = operation
                            if (operationId) return { operationId, summary }
                        }
                    }
                }
                return []
            }),
        )
    }

    private formatHandlers(operations: string[]): string {
        const operationsFormatted = operations.reduce(
            (prev, curr) => `${prev}\n${curr}`,
        )

        return `${disableLinter}

${fastifyImports}
${openapiSchemasImport}


${handlersInterfacePrefix}
${operationsFormatted}
${handlersInterfacePostfix}
`
    }
}
