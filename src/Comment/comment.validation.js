import  Joi from '@hapi/joi'

export const addParentCommentValidation = (data) => {

    const schema = Joi.object({
        poster: Joi.string().required(),
        restaurant: Joi.string(),
        content: Joi.string().required()

    })
    return schema.validate(data)
}
