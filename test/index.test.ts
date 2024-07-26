import { OpenApiVersionVerifier } from './../src/openapi-version-verifier/openapi-version-verifier'
import { OpenapiParser } from './../src/openapi-parser/openapi-parser'
import 'mocha'
import { HandlersGenerator, RoutesSchemasGenerator } from '../src/index'
import { OpenapiReader } from '../src/openapi-reader/openapi-reader'
import fs from 'fs'

describe('Dummy', () => {
    it('hello world', () => {
        // const openapiPath = `${__dirname}/../local/openapi.yml`
        // const reader = new OpenapiReader()
        // const parser = new OpenapiParser()
        // const versionVerifier = new OpenApiVersionVerifier()
        // const routesSchemasGenerator = new RoutesSchemasGenerator(
        //     reader,
        //     parser,
        //     versionVerifier,
        //     openapiPath,
        // )
        // const result = routesSchemasGenerator.generateRoutesSchemas()
        // const handlersGenerator = new HandlersGenerator(
        //     reader,
        //     parser,
        //     openapiPath,
        // )
        // const handlers = handlersGenerator.generateHandlers()
        console.log('hello world')
    })
})
