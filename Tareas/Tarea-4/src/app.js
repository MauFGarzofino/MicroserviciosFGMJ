import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

// Swagger
import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec } from './config/swagger.js';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas de API
app.use('/api', router);

// Swagger UI y JSON
const swaggerSpec = buildSwaggerSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

// Middlewares finales
app.use(notFound);
app.use(errorHandler);

export default app;
