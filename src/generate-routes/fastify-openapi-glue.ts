import fs from 'fs'
import path from 'path'
import { disableLinter, fastifyRouteOptionsImports } from '../utils/consts.js'
import { mkdirIfNotExists } from '../utils/fs.js'
import { Parser } from './fastify-openapi-glue/Parser.js'
import {
    RoutesOptionsGenerator,
    RoutesOptionsGeneratorFactory,
} from './generate-routes-options.models.js'

const { writeFile } = fs.promises

export const fastifyOpenapiGlue: RoutesOptionsGeneratorFactory = ({
    openapi,
    outputDirectory,
}) => {
    const generateRoutesOptions: RoutesOptionsGenerator['generateRoutesOptions'] =
        async operationIds => {
            await mkdirIfNotExists(outputDirectory)

            const parser = new Parser()
            const config = await parser.parse(openapi)

            let parsedRoutes = config.routes as any[]
            if (operationIds && operationIds.length > 0)
                parsedRoutes = parsedRoutes.filter(item =>
                    operationIds.includes(item.operationId),
                )
            const routes = parsedRoutes.map((item: any) => {
                const routeCfg = {
                    method: item.method,
                    url: item.url,
                    schema: item.schema,
                    config: item.config,
                }
                const routesString = JSON.stringify(routeCfg, null, 2)
                const fileContent = `${disableLinter}

${fastifyRouteOptionsImports}

export const ${item.operationId}: GenericRouteOptions =
${routesString}
            `
                return writeFile(
                    path.join(outputDirectory, `${item.operationId}.ts`),
                    fileContent,
                )
            })
            await Promise.all(routes)
        }

    return { generateRoutesOptions }
}
