import fs from 'fs'

export class OpenapiReader {
    readOpenapi(openapiFilePath: string): string {
        return fs.readFileSync(openapiFilePath, 'utf-8')
    }
}
