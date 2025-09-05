import Joi from 'joi';

export const createDetailSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).required(),
    unitPrice: Joi.number().precision(2).min(0).required()
});

export const updateDetailSchema = Joi.object({
    productId: Joi.string().hex().length(24),
    quantity: Joi.number().integer().min(1),
    unitPrice: Joi.number().precision(2).min(0)
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ message: error.message });
        req.body = value;
        next();
    };
}
