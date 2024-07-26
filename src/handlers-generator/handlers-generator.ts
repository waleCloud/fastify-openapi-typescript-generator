import { OpenapiParser } from '../openapi-parser/openapi-parser.js'
import { OpenapiReader } from '../openapi-reader/openapi-reader.js'
import { disableLinter } from '../utils/consts.js'
import { methods } from '../utils/openapi.js'
import { OpenAPIVX } from '../utils/types.js'
import {
    fastifyImports,
    handlersInterfacePostfix,
    handlersInterfacePrefix,
    openapiOperationsImport,
    openapiOperationsImportName,
    valueOfType,
} from './handlers-generator.constants.js'
import { HandlerProperties } from './handlers-generator.models.js'

export class HandlersGenerator {
    constructor(
        private readonly openapiReader: OpenapiReader,
        private readonly openapiParser: OpenapiParser,
        private readonly openapiFilePath: string,
        private readonly typesModule: string,
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
        if (typeof summary == 'string') {
            return `
  /**
   * ${summary}
   */`
        }

        return ''
    }

    private getRouteGeneric(operationId: string): string {
        const routeGenricDefinition = `
            Params: ${openapiOperationsImportName}['${operationId}']['parameters']['path']
            Querystring: ${openapiOperationsImportName}['${operationId}']['parameters']['query']
            Body: ${openapiOperationsImportName}['${operationId}']['requestBody']['content']['application/json']
            Reply: ValueOf<${openapiOperationsImportName}['${operationId}']['responses']>['content']['application/json']
            Headers: ${openapiOperationsImportName}['${operationId}']['parameters']['header']
        `
        return `{\n${routeGenricDefinition}\n\t}`
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
                if (path && path[method]) {
                    const { operationId, summary } = path[method]
                    if (operationId) return { operationId, summary }
                }
                return []
            }),
        )
    }

    private formatHandlers(operations: string[]): string {
        const operationsFormatted = operations.join('\n')

        return `${disableLinter}

${fastifyImports}
${openapiOperationsImport(this.typesModule)}

${valueOfType}


${handlersInterfacePrefix}
${operationsFormatted}
${handlersInterfacePostfix}
`
    }
}
