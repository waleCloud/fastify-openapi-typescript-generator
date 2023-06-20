import fs from 'fs'
import path from 'path'
import { disableLinter, fastifyRouteOptionsImports } from '../utils/consts.js'
import { mkdirIfNotExists } from '../utils/fs.js'
import { Parser } from './fastify-openapi-glue/Parser.js'
import {
    allowedProperties,
    commonTypesFileName,
    configsFolder,
} from './generate-routes-options.consts.js'
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
            const configsPath = path.join(outputDirectory, configsFolder)
            await mkdirIfNotExists(configsPath)

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
                    schema: parseSchema(item.schema),
                    config: item.config,
                }

                const routesString = JSON.stringify(routeCfg, null, 2)
                const fileContent = `${disableLinter}

import { GenericRouteOptions } from '../${commonTypesFileName}'

export const ${item.operationId}: GenericRouteOptions =
${routesString}
            `
                return writeFile(
                    path.join(configsPath, `${item.operationId}.ts`),
                    fileContent,
                )
            })
            await Promise.all(routes)

            await writeFile(
                path.join(outputDirectory, `${commonTypesFileName}.ts`),
                `${disableLinter}

${fastifyRouteOptionsImports}
`,
            )

            await writeFile(
                path.join(outputDirectory, 'index.ts'),
                getIndexFileContent(parsedRoutes),
            )
        }

    return { generateRoutesOptions }
}

const getIndexFileContent = (routes: any[]) => {
    const routesExports = routes
        .map(
            item =>
                `export * from './${path.join(
                    configsFolder,
                    item.operationId,
                )}'`,
        )
        .join('\n')

    return `${disableLinter}

${routesExports}
`
}

const parseSchema = (schema: any) =>
    allowedProperties.reduce((acc, prop) => {
        if (prop in schema) acc[prop] = schema[prop]
        return acc
    }, {} as any)
