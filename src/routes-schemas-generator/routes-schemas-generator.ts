import { OpenapiManager } from '../openapi-manger/openapi-manager.models.js'
import { OpenApiManagerV3_0 } from '../openapi-manger/v3_0/openapi-manager-v3_0.service.js'
import { OpenApiManagerV3_1 } from '../openapi-manger/v3_1/openapi-manager-v3_1.service.js'
import { OpenapiParser } from '../openapi-parser/openapi-parser.js'
import { OpenapiReader } from '../openapi-reader/openapi-reader.js'
import { OpenApiVersionVerifier } from '../openapi-version-verifier/openapi-version-verifier.js'
import { OpenApiVersion } from '../openapi-version-verifier/openapi-version-verifier.models.js'
import { OpenAPIVX } from '../utils/types.js'

export class RoutesSchemasGenerator {
    constructor(
        private readonly openapiReader: OpenapiReader,
        private readonly openapiParser: OpenapiParser,
        private readonly openapiVersionVerifier: OpenApiVersionVerifier,
        private readonly openapiFilePath: string,
    ) {}

    generateRoutesSchemas(): OpenAPIVX {
        const openapiRaw = this.openapiReader.readOpenapi(this.openapiFilePath)
        const openapi = this.openapiParser.parseOpeanpi(openapiRaw)
        const manager = this.getOpenapiManager(openapi)
        return manager.generateOpenapiWithRoutesSchemas(openapi)
    }

    getOpenapiManager(openapi: OpenAPIVX): OpenapiManager<OpenAPIVX> {
        const version = this.openapiVersionVerifier.getOpenApiVersion(openapi)
        switch (version) {
            case OpenApiVersion.V3_1:
                return new OpenApiManagerV3_1()
            case OpenApiVersion.V3_0:
                return new OpenApiManagerV3_0()
        }
    }
}
