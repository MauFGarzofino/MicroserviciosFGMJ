import Joi from 'joi';

export const createInvoiceSchema = Joi.object({
    date: Joi.date().required(),
    clientId: Joi.string().hex().length(24).required()
});

export const updateInvoiceSchema = Joi.object({
    date: Joi.date(),
    clientId: Joi.string().hex().length(24)
}).min(1);

export function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) return res.status(400).json({ message: error.message });
        req.body = value;
        next();
    };
}
