import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: { title: 'API de Vehículos', version: '1.0.0' }
    },
    apis: ['./src/index.js']
});
