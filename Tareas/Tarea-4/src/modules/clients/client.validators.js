import Joi from 'joi';

export const createClientSchema = Joi.object({
    ci: Joi.string().max(20).required(),
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    sex: Joi.string().valid('M', 'F', 'O').required()
});

export const updateClientSchema = Joi.object({
    ci: Joi.string().max(20),
    firstName: Joi.string().max(100),
    lastName: Joi.string().max(100),
    sex: Joi.string().valid('M', 'F', 'O')
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ message: error.message });
        req.body = value;
        next();
    };
}
