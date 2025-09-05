import swaggerJSDoc from 'swagger-jsdoc';

const openapiDefinition = {
    openapi: '3.0.3',
    info: {
        title: 'Sales API',
        version: '1.0.0',
        description:
            'API REST para gestionar productos, clientes, facturas y detalles de facturas.'
    },
    servers: [
        { url: 'http://localhost:3000/api', description: 'Local' }
    ],
    tags: [
        { name: 'Products', description: 'Gestión de productos' },
        { name: 'Clients', description: 'Gestión de clientes' },
        { name: 'Invoices', description: 'Gestión de facturas' },
        { name: 'InvoiceDetails', description: 'Gestión de detalles de factura' }
    ],
    components: {
        schemas: {

            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '66eec0a8e0a9f8a51d5a7e1b' },
                    name: { type: 'string', example: 'Laptop' },
                    description: { type: 'string', nullable: true, example: '14" FHD' },
                    brand: { type: 'string', example: 'Lenovo' },
                    stock: { type: 'integer', minimum: 0, example: 5 },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            Client: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    ci: { type: 'string', example: '12345678' },
                    firstName: { type: 'string', example: 'Mauro' },
                    lastName: { type: 'string', example: 'Guzmán' },
                    sex: { type: 'string', enum: ['M', 'F', 'O'], example: 'M' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },

            // Refs "poblados"
            ClientRef: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    ci: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    sex: { type: 'string', enum: ['M', 'F', 'O'] },
                    id: { type: 'string', description: 'stringified _id (Mongoose virtual)' }
                }
            },
            ProductRef: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '68b9b35021cfb6408376326b' },
                    name: { type: 'string', example: 'Servilletas' },
                    brand: { type: 'string', example: 'Scott' },
                    id: { type: 'string' }
                }
            },

            // DTOs
            CreateProductDto: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    brand: { type: 'string', nullable: true },
                    stock: { type: 'integer', minimum: 0, default: 0 }
                }
            },
            UpdateProductDto: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    brand: { type: 'string', nullable: true },
                    stock: { type: 'integer', minimum: 0 }
                }
            },
            CreateClientDto: {
                type: 'object',
                required: ['ci', 'firstName', 'lastName', 'sex'],
                properties: {
                    ci: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    sex: { type: 'string', enum: ['M', 'F', 'O'] }
                }
            },
            UpdateClientDto: {
                type: 'object',
                properties: {
                    ci: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    sex: { type: 'string', enum: ['M', 'F', 'O'] }
                }
            },
            CreateInvoiceDto: {
                type: 'object',
                required: ['date', 'clientId'],
                properties: {
                    // Usa 'date-time' si aceptas hora; si es solo fecha, deja 'date'
                    date: { type: 'string', format: 'date-time' },
                    clientId: { type: 'string' }
                }
            },
            UpdateInvoiceDto: {
                type: 'object',
                properties: {
                    date: { type: 'string', format: 'date-time' },
                    clientId: { type: 'string' }
                }
            },

            InvoiceDetail: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '68ba31a2dff4c4d79dd97b34' },
                    product: {
                        oneOf: [
                            { type: 'string', description: 'ObjectId de Product', example: '68b9b35021cfb6408376326b' },
                            { $ref: '#/components/schemas/ProductRef' }
                        ]
                    },
                    quantity: { type: 'integer', minimum: 1, example: 12 },
                    unitPrice: { type: 'number', minimum: 0, example: 10 },
                    id: { type: 'string' }
                }
            },

            // Factura (con oneOf para client poblado)
            Invoice: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    client: {
                        oneOf: [
                            { type: 'string', description: 'ObjectId de Client' },
                            { $ref: '#/components/schemas/ClientRef' }
                        ]
                    },
                    details: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/InvoiceDetail' }
                    },
                    total: { type: 'number', example: 120 },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    __v: { type: 'integer' },
                    id: { type: 'string' }
                }
            },

            // Respuesta paginada de productos (ya con example)
            PaginatedProductResponse: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 25 },
                    totalPages: { type: 'integer', example: 3 },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Product' }
                    }
                },
                example: {
                    page: 1,
                    limit: 10,
                    total: 2,
                    totalPages: 1,
                    items: [
                        {
                            _id: "68b9b35021cfb6408376326b",
                            name: "Servilletas",
                            description: "Paquete de 200 hojas",
                            brand: "Scott",
                            stock: 50,
                            createdAt: "2025-09-05T00:00:00.000Z",
                            updatedAt: "2025-09-05T00:42:33.484Z"
                        },
                        {
                            _id: "68b9b36021cfb64083763270",
                            name: "Laptop",
                            description: "Laptop Lenovo 14''",
                            brand: "Lenovo",
                            stock: 12,
                            createdAt: "2025-09-04T18:12:00.000Z",
                            updatedAt: "2025-09-04T18:12:00.000Z"
                        }
                    ]
                },
                PaginatedInvoiceResponse: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 2 },
                        totalPages: { type: 'integer', example: 1 },
                        items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Invoice' }
                        }
                    },
                    example: {
                        page: 1,
                        limit: 10,
                        total: 2,
                        totalPages: 1,
                        items: [
                            {
                                _id: "68ba2c5e596af42acd162e85",
                                date: "2025-09-05T00:00:00.000Z",
                                client: {
                                    _id: "68b9ef8e10775f6f270e4827",
                                    ci: "10394235",
                                    firstName: "user",
                                    lastName: "test",
                                    sex: "F"
                                },
                                details: [
                                    {
                                        _id: "68ba31a2dff4c4d79dd97b34",
                                        product: {
                                            _id: "68b9b35021cfb6408376326b",
                                            name: "Servilletas",
                                            brand: "Scott"
                                        },
                                        quantity: 12,
                                        unitPrice: 10
                                    }
                                ],
                                total: 120,
                                createdAt: "2025-09-05T00:18:38.513Z",
                                updatedAt: "2025-09-05T00:42:33.484Z",
                                __v: 1
                            }
                        ]
                    }
                },
            }
        },

        examples: {
            CreateInvoiceDetailBody: {
                summary: 'Body para crear detalle',
                value: {
                    productId: '68b9b35021cfb6408376326b',
                    quantity: 12,
                    unitPrice: 10
                }
            },
            UpdateInvoiceDetailBody: {
                summary: 'Body para actualizar detalle (parcial)',
                value: {
                    quantity: 15,
                    unitPrice: 9.5
                }
            },
            InvoiceDetailPopulated: {
                summary: 'Detalle con product poblado',
                value: {
                    _id: '68ba31a2dff4c4d79dd97b34',
                    product: {
                        _id: '68b9b35021cfb6408376326b',
                        name: 'Servilletas',
                        brand: 'Scott'
                    },
                    quantity: 12,
                    unitPrice: 10
                }
            }
        }
    }
};
export const swaggerOptions = {
    definition: openapiDefinition,
    // busca anotaciones en estos archivos:
    apis: [
        './src/modules/**/*.routes.js'
    ]
};

export function buildSwaggerSpec() {
    return swaggerJSDoc(swaggerOptions);
}
