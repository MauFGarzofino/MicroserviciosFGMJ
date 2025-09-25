import swaggerJSDoc from 'swagger-jsdoc';

const openapiDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'Primer Parcial',
        version: '1.0.0',
        description:
            'API REST'
    },
    servers: [
        { url: 'http://localhost:3000/api', description: 'Local' }
    ],
    tags: [
        { name: 'Workers', description: 'Gestión de trabajadores' },
    ],
    components: {
        schemas: {
            Worker: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66eec0a8e0a9f8a51d5a7e1b' },
                    nombres: { type: 'string', example: 'Mauricio' },
                    apellidos: { type: 'string', example: 'Garzofino' },
                    fecha_nacimiento: { type: 'Date', format: 'date-time', example: '2003-04-04' },
                    direccion: { type: 'string', nullable: true, example: 'Destacamento 130' },
                    celular: { type: 'string', example: '67947958' },
                    correo: { type: 'string', example: 'mau@gmail.com' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },

            // DTOs
            CreateWorkerDto: {
                type: 'object',
                required: ['nombres'],
                properties: {
                    nombres: { type: 'string' },
                    apellidos: { type: 'string', nullable: true },
                    fecha_nacimiento: { type: 'string', format: 'date-time', nullable: true },
                    direccion: { type: 'string', nullable: true },
                    celular: { type: 'string', nullable: true },
                    correo: { type: 'string', nullable: true }
                }
            },
            UpdateWorkerDto: {
                type: 'object',
                properties: {
                    nombres: { type: 'string' },
                    apellidos: { type: 'string', nullable: true },
                    fecha_nacimiento: { type: 'string', nullable: true },
                    direccion: { type: 'string', nullable: true },
                    celular: { type: 'string', nullable: true },
                    correo: { type: 'string', nullable: true }
                }
            },
            PaginatedWorkerResponse: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 25 },
                    totalPages: { type: 'integer', example: 3 },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Worker' }
                    }
                },
                example: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1,
                    items: [
                        {
                            _id: "66eec0a8e0a9f8a51d5a7e1b",
                            nombres: "Mauricio",
                            apellidos: "Garzofino",
                            fecha_nacimiento: "2003-04-04",
                            direccion: "Destacamento 130",
                            celular: "67947958",
                            correo: "mau@gmail.com",
                            createdAt: "2025-09-25T19:42:00.284Z",
                            updatedAt: "2025-09-25T19:42:00.284Z"
                        }
                    ]
                },
            }
        },
    }
};
export const swaggerOptions = {
    definition: openapiDefinition,
    apis: [
        './src/modules/**/*.routes.js'
    ]
};

export function buildSwaggerSpec() {
    return swaggerJSDoc(swaggerOptions);
}
