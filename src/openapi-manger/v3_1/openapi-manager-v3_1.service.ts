import { OpenapiManager } from '../openapi-manager.models'
import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'
import { AnyObjectType, RouteTypeTag } from '../../utils/types'

export class OpenApiManagerV3_1
    implements OpenapiManager<OpenAPIV3_1.Document>
{
    generateOpenapiWithRoutesSchemas(
        openapi: OpenAPIV3_1.Document,
    ): OpenAPIV3_1.Document {
        const methods = Object.values(OpenAPIV3.HttpMethods)
        if (openapi.paths === undefined) throw new Error('no paths')

        const paths = Object.values(openapi.paths)
            .singleCollect(
                path => path != undefined,
                path => path as OpenAPIV3_1.PathItemObject,
            )
            .flatMap(path =>
                methods.singleCollect(
                    method => method in path,
                    method => path[method] as OpenAPIV3_1.OperationObject,
                ),
            )

        const defaultOpenapiParamsObjectSchema: OpenAPIV3_1.SchemaObject = {
            type: 'object',
            additionalProperties: false,
        }

        function referenceToDesiredObject<T extends AnyObjectType>(
            componentName: keyof OpenAPIV3_1.ComponentsObject,
            { $ref }: OpenAPIV3_1.ReferenceObject,
        ): T {
            const componentId = $ref.replace(
                `#/components/${componentName}/`,
                '',
            )

            if (openapi.components != undefined) {
                const component = openapi.components[componentName]
                if (component != undefined) {
                    const componentElement = component[componentId]
                    if (componentElement != undefined) {
                        if (isReferenceObject(componentElement))
                            return referenceToDesiredObject(
                                componentName,
                                componentElement,
                            )
                        return componentElement as T //TODO find a way to remove this as
                    }
                }
            }
            throw new Error() //TODO
        }

        function isReferenceObject(
            x: AnyObjectType,
        ): x is OpenAPIV3_1.ReferenceObject {
            return '$ref' in x
        }

        function retrieveParameterObjects(
            params: (
                | OpenAPIV3_1.ReferenceObject
                | OpenAPIV3_1.ParameterObject
            )[],
        ): OpenAPIV3_1.ParameterObject[] {
            return params.singleCollect(
                isReferenceObject,
                param =>
                    referenceToDesiredObject(
                        'parameters',
                        param as OpenAPIV3_1.ReferenceObject,
                    ),
                param => param as OpenAPIV3_1.ParameterObject,
            )
        }

        const defaultObject: OpenAPIV3_1.SchemaObject = {
            type: 'object',
            additionalProperties: false,
        }

        function paramsToSchema(
            params?: OpenAPIV3_1.ParameterObject[],
        ): OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject {
            if (params && params.length > 0) {
                const required = params.singleCollect(
                    x => x.required === true,
                    x => x.name,
                )
                const properties = params.groupByToDictionary(
                    x => x.name,
                    x =>
                        x.schema as
                            | OpenAPIV3_1.ReferenceObject
                            | OpenAPIV3_1.SchemaObject,
                )
                const result = {
                    ...defaultOpenapiParamsObjectSchema,
                    properties,
                }
                if (required.length > 0) result.required = required
                return result
            }

            return defaultObject
        }

        const pathsSchemas = paths.reduce(
            (result, { operationId, parameters, requestBody, responses }) => {
                const params = retrieveParameterObjects(parameters ?? [])
                const paramsByScope = params.simpleGroupBy(x => x.in)

                const pathParamsSchema = paramsToSchema(
                    paramsByScope.get('path'),
                )
                const pathParamsSchemaName = `${operationId}${RouteTypeTag.PathParams}`
                result[pathParamsSchemaName] = pathParamsSchema

                const queryParamsSchema = paramsToSchema(
                    paramsByScope.get('query'),
                )
                const queryParamsSchemaName = `${operationId}${RouteTypeTag.QueryParams}`
                result[queryParamsSchemaName] = queryParamsSchema

                const bodySchemaName = `${operationId}${RouteTypeTag.RequestBody}`
                result[bodySchemaName] = defaultObject
                if (requestBody != undefined) {
                    const requestBodyObject: OpenAPIV3_1.RequestBodyObject =
                        isReferenceObject(requestBody)
                            ? referenceToDesiredObject(
                                  'requestBodies',
                                  requestBody,
                              )
                            : requestBody
                    const bodyMedias = Object.entries(requestBodyObject.content)
                    if (bodyMedias.length > 0) {
                        const [[, bodyMediaObject]] = bodyMedias
                        result[bodySchemaName] =
                            bodyMediaObject.schema ?? defaultObject
                    }
                }

                const replySchemaName = `${operationId}${RouteTypeTag.ReplyBody}`
                result[replySchemaName] = defaultObject
                if (responses) {
                    const replySchemas = Object.values(responses)
                        .flatMap(response => {
                            const responseObject: OpenAPIV3_1.ResponseObject =
                                isReferenceObject(response)
                                    ? referenceToDesiredObject(
                                          'responses',
                                          response,
                                      )
                                    : response
                            const { content } = responseObject
                            if (content) {
                                const medias = Object.values(content)
                                return medias.map(
                                    mediaObject => mediaObject.schema,
                                )
                            }
                            return []
                        })
                        .singleCollect(
                            schema => schema != undefined,
                            schema =>
                                schema as
                                    | OpenAPIV3_1.ReferenceObject
                                    | OpenAPIV3_1.SchemaObject,
                        )
                    if (replySchemas.length === 1)
                        result[replySchemaName] = replySchemas[0]
                    else if (replySchemas.length > 1)
                        result[replySchemaName] = { oneOf: replySchemas }
                }

                return result
            },
            {} as Record<string, OpenAPIV3_1.SchemaObject>,
        )

        const newOpenapi = { ...openapi }
        if (!newOpenapi.components) newOpenapi.components = {}
        newOpenapi.components.schemas = {
            ...newOpenapi.components.schemas,
            ...pathsSchemas,
        }

        return newOpenapi
    }
}
