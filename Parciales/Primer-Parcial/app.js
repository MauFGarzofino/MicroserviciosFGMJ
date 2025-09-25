import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';

import swaggerUi from 'swagger-ui-express';
import { buildSwaggerSpec } from './config/swagger.js';

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', router);

const swaggerSpec = buildSwaggerSpec();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));

export default app;
