import Joi from 'joi'

export type Environment = {
    PWD: string
}

export type JoiEnvironment = Record<keyof Environment, Joi.AnySchema>

export const JoiEnvironmentValidationSchema = Joi.object<JoiEnvironment>()
    .keys({
        PWD: Joi.string().required(),
    })
    .unknown()

export function getEnvironment(): Environment {
    const env = process.env
    const { error, warning } = JoiEnvironmentValidationSchema.validate(env)
    if (error) throw error
    if (warning) console.error(warning)

    return env as Environment
}
