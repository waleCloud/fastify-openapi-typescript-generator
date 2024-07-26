// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Parser } = require('fastify-openapi-glue/lib/Parser')
import '@quinck/collections'
import { RouteOptions } from 'fastify'
import fs from 'fs'
import {
    RoutesOptionsGenerator,
    RoutesOptionsGeneratorFactory,
} from './generate-routes-options.models.js'

type GeneratedRouteOptions = Pick<
    RouteOptions,
    'method' | 'url' | 'schema' | 'config'
>

export const fastifyOpenapiGlue: RoutesOptionsGeneratorFactory = ({
    openapi,
    outputDirectory,
}) => {
    const generateRoutesOptions: RoutesOptionsGenerator['generateRoutesOptions'] =
        async operationIds => {
            const parser = new Parser()
            const config = await parser.parse(openapi)

            await fs.promises.mkdir(outputDirectory)

            let parsedRoutes = config.routes as any[]

            if (operationIds && operationIds.length > 0)
                parsedRoutes = parsedRoutes.filter(item =>
                    operationIds.includes(item.operationId),
                )

            const routes = parsedRoutes.map((item: any) => {
                const routeCfg: GeneratedRouteOptions = {
                    method: item.method,
                    url: item.url,
                    schema: item.schema,
                    config: item.config,
                }
                const fileContent = `export default const ${item.operationId} =
${JSON.stringify(routeCfg, null, 2)}
`
                return fs.promises.writeFile(
                    `${item.operationId}.ts`,
                    fileContent,
                )
            })

            await Promise.all(routes)
        }

    return {
        generateRoutesOptions,
    }
}
