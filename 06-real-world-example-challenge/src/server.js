import express from 'express';
import { indexRouter as apiRouter } from './routes/index.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});