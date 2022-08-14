import { OpenAPIVX } from '../utils/types'
import { OpenApiVersion } from './openapi-version-verifier.models'

export class OpenApiVersionVerifier {
    getOpenApiVersion(openapi: OpenAPIVX): OpenApiVersion {
        const { version } = openapi.info

        const avaliableVersion = Object.values(OpenApiVersion).find(
            availableVersion => availableVersion === version,
        )

        if (avaliableVersion != undefined) return avaliableVersion

        throw new Error(`The openapi version ${version} is not supported`)
    }
}
