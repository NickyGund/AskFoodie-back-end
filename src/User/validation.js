import  Joi from '@hapi/joi'


 export const registerValidation = (data) => {

    const schema = Joi.object( {
        email: Joi.string().required().email(),
        userName:Joi.string().required(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string().required().min(6),
        birthdate:Joi.date().required(),
        signedIn: Joi.boolean(),
        admin: Joi.boolean()
    })

    return schema.validate(data)

}

export const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6)
    })

    return schema.validate(data)
}

