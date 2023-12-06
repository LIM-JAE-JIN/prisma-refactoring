import express from 'express';
import 'dotenv/config'
import { apiRouter } from './routers/index.js';

import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.use(ErrorHandlingMiddleware);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App listening on port ${process.env.SERVER_PORT}`);
});
