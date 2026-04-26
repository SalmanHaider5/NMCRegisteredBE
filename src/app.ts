import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import { userRoutes, authRoutes } from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('public'));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/health', async (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;