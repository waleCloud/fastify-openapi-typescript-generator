import { OpenAPIVX } from '../utils/types'
import { generate as generateSchemas } from 'openapi-typescript-codegen'

export class SchemasGenerator {
    constructor(
        private readonly openapi: OpenAPIVX,
        private readonly outputDirectory: string,
    ) {}

    async generateSchemas(): Promise<void> {
        await generateSchemas({
            input: this.openapi,
            output: this.outputDirectory,
            exportCore: false,
            exportServices: false,
            exportSchemas: false,
        })
    }
}
