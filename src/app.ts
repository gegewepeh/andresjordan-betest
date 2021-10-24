if (process.env.NODE_ENV !== 'production') { require('dotenv').config() };
import express from 'express';
import router from './routes/index'
import errorHandler from './middlewares/error_handler';

const app = express()

app.use(router)

app.use(errorHandler)

export default app