import express from 'express';
import cors from 'cors';
import { appsRouter } from './routes/apps';
import { screenshotsRouter } from './routes/screenshots';
import { errorHandler } from './middleware/error-handler';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/apps', appsRouter);
app.use('/api/apps', screenshotsRouter);

app.use(errorHandler);
