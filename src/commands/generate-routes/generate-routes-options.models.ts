import { OpenAPIVX } from '../../utils/types'

export type RoutesOptionsGeneratorParameters = {
    readonly openapi: OpenAPIVX | string
    readonly outputDirectory: string
}

export interface RoutesOptionsGenerator {
    generateRoutesOptions(operationIds?: string[]): Promise<void>
}

export type RoutesOptionsGeneratorFactory = (
    parameters: RoutesOptionsGeneratorParameters,
) => RoutesOptionsGenerator
