import { Validator } from '@seriousme/openapi-schema-validator'
import { ParserV2 } from './Parser.v2.js'
import { ParserV3 } from './Parser.v3.js'

export class Parser {
    private original: object | undefined

    constructor() {}

    specification(): object | undefined {
        return this.original
    }

    async preProcessSpec(specification: string | object): Promise<any> {
        const validator = new Validator()
        try {
            const res = await validator.validate(specification)
            if (res.valid) {
                this.original = JSON.parse(
                    JSON.stringify(validator.specification, null, 2),
                )
                return {
                    valid: true,
                    version: validator.version,
                    spec: validator.resolveRefs(),
                }
            }
            throw new Error(JSON.stringify(res.errors, null, 2))
        } catch (e) {
            return { valid: false }
        }
    }

    async parse(specification: string | object): Promise<any> {
        const supportedVersions = new Set(['2.0', '3.0', '3.1'])

        const res = await this.preProcessSpec(specification)
        if (!(res.valid && supportedVersions.has(res.version))) {
            throw new Error(
                "'specification' parameter must contain a valid version 2.0 or 3.0.x or 3.1.x specification",
            )
        }

        if (res.version === '2.0') {
            const parserV2 = new ParserV2()
            return parserV2.parse(res.spec)
        }

        const parserV3 = new ParserV3()
        return parserV3.parse(res.spec)
    }
}
