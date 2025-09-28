import express from 'express';
import cookieParser from 'cookie-parser';
import { indexRouter as apiRouter } from './routes/index.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
