import openapiTS from '@quinck/openapi-typescript'

export const generateOpenapiTypes = (
    openapiFilePath: string,
): Promise<string> => {
    const localPath = new URL(openapiFilePath, __dirname)

    return openapiTS(localPath)
}
