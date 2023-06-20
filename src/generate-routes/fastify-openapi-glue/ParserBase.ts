export class ParserBase {
    protected config: any

    constructor() {
        this.config = { generic: {}, routes: [], contentTypes: new Set() }
    }

    makeOperationId(operation: string, path: string): string {
        const firstUpper = (str: string): string =>
            str.substr(0, 1).toUpperCase() + str.substr(1)
        const by = (matched: string, p1: string): string =>
            `By${firstUpper(p1)}`
        const parts = path.split('/').slice(1)
        parts.unshift(operation)
        const opId = parts
            .map((item, i) => (i > 0 ? firstUpper(item) : item))
            .join('')
            .replace(/{(\w+)}/g, by)
            .replace(/[^a-z]/gi, '')
        return opId
    }

    makeURL(path: string): string {
        return path.replace(/{(\w+)}/g, ':$1')
    }

    copyProps(
        source: Record<string, unknown>,
        target: Record<string, unknown>,
        list: string[],
        copyXprops = false,
    ): void {
        Object.keys(source).forEach(item => {
            if (list.includes(item) || (copyXprops && item.startsWith('x-'))) {
                target[item] = source[item]
            }
        })
    }

    parseSecurity(
        schemes: Record<string, unknown>[] | undefined,
    ): { name: string; parameters: unknown }[] | undefined {
        return schemes
            ? schemes.map(item => {
                  const name = Object.keys(item)[0]
                  return {
                      name,
                      parameters: item[name],
                  }
              })
            : undefined
    }

    removeRecursion(schemas: Record<string, Record<string, unknown>>): void {
        function escapeJsonPointer(str: string): string {
            return str.replace(/~/g, '~0').replace(/\//g, '~1')
        }

        function processSchema(obj: any): void {
            let refAdded = false

            function inspectNode(
                obj: any,
                path: string,
                paths: Map<any, string>,
            ): string | undefined {
                if (typeof obj === 'object' && obj !== null) {
                    if (paths.has(obj)) {
                        return paths.get(obj)
                    }
                    const newPaths = new Map(paths)
                    newPaths.set(obj, path)
                    for (const key in obj) {
                        const $ref = inspectNode(
                            obj[key],
                            `${path}/${escapeJsonPointer(key)}`,
                            newPaths,
                        )
                        if (typeof $ref === 'string') {
                            obj[key] = { $ref }
                            refAdded = true
                        }
                    }
                }
                return undefined
            }

            const paths = new Map<string, string>()
            inspectNode(obj, '#', paths)
            if (refAdded && typeof obj['$id'] === 'undefined') {
                obj['$id'] = 'http://example.com/fastifySchema'
            }
        }

        for (const item in schemas) {
            const schema = schemas[item]
            if (item === 'response') {
                for (const responseCode in schema) {
                    processSchema(schema[responseCode])
                }
            } else {
                processSchema(schema)
            }
        }
    }
}
