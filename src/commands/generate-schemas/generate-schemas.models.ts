import { OpenAPIVX } from '../../utils/types'

export type SchemasGeneratorParameters = {
    readonly openapi: OpenAPIVX
    readonly outputDirectory: string
}

export interface SchemasGenerator {
    generateSchemas(): Promise<void>
}

export type SchemasGeneratorFactory = (
    parameters: SchemasGeneratorParameters,
) => SchemasGenerator
