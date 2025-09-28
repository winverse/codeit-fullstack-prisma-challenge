import express from 'express';
import cookieParser from 'cookie-parser';
import { indexRouter as apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { config } from './config/config.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRouter);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server is running at http://localhost:${config.PORT}`);
});