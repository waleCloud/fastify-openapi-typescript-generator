export enum CommandName {
    GENERATE_SCHEMAS = 'generate-schemas',
    GENERATE_HANDLERS = 'generate-handlers',
}

export type DefaultCommandParamaters = {
    input: string
    output: string
}

export interface CommandsHandler {
    onGenerateSchemasComand(parameters: DefaultCommandParamaters): Promise<void>
    onGenerateHandlersCommand(
        parameters: DefaultCommandParamaters,
    ): Promise<void>
}
