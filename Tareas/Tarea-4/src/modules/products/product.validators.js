import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().min(1).max(150).required(),
    description: Joi.string().allow('', null),
    brand: Joi.string().allow('', null),
    stock: Joi.number().integer().min(0).default(0)
});

export const updateProductSchema = Joi.object({
    name: Joi.string().min(1).max(150),
    description: Joi.string().allow('', null),
    brand: Joi.string().allow('', null),
    stock: Joi.number().integer().min(0)
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ message: error.message });
        req.body = value;
        next();
    };
}
