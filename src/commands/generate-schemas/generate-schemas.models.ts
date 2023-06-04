import { OpenAPIVX } from '../../utils/types.js'

export type SchemasGeneratorParameters = {
    readonly openapi: OpenAPIVX | string
    readonly outputDirectory: string
}

export interface SchemasGenerator {
    generateSchemas(): Promise<void>
}

export type SchemasGeneratorFactory = (
    parameters: SchemasGeneratorParameters,
) => SchemasGenerator
