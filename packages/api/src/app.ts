import express from 'express';
import cors from 'cors';
import path from 'path';
import { appsRouter } from './routes/apps';
import { screenshotsRouter } from './routes/screenshots';
import { errorHandler } from './middleware/error-handler';

export const app = express();

app.use(cors());
app.use(express.json());

// Serve locally stored screenshots when S3 is not configured
const localScreenshotsDir = path.resolve(__dirname, '../../../local-screenshots');
app.use('/screenshots', express.static(localScreenshotsDir));

app.use('/api/apps', appsRouter);
app.use('/api/apps', screenshotsRouter);

app.use(errorHandler);
