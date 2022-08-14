import { OpenAPIVX } from '../utils/types'
import { OpenApiVersion } from './openapi-version-verifier.models'

export class OpenApiVersionVerifier {
    getOpenApiVersion(openapi: OpenAPIVX): OpenApiVersion {
        const version = openapi.openapi

        const avaliableVersion = Object.values(OpenApiVersion).find(
            availableVersion => version.startsWith(availableVersion),
        )

        if (avaliableVersion != undefined) return avaliableVersion

        throw new Error(`The openapi version ${version} is not supported`)
    }
}
