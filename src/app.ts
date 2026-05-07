import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import {
  userRoutes,
  authRoutes,
  subscriptionRoutes,
  companyRoutes,
  professionalRoutes,
  phoneRoutes,
  shiftsRoutes,
  timesheetRoutes,
  planRoutes,
} from './routes';
import { errorHandler } from './middlewares';
import { SubscriptionController } from './modules/subscription/subscription.controller';
import { initJobs } from './jobs';

const app = express();

app.post(
  '/api/subscription/stripe/webhook',
  express.raw({ type: 'application/json' }),
  SubscriptionController.confirmStripePayment,
);

app.post(
  '/api/subscription/paypal/webhook',
  express.raw({ type: 'application/json' }),
  SubscriptionController.confirmPaypalPayment,
);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('public'));
app.use(express.static(path.join(__dirname, '../build')));

initJobs();

app.get('/health', async (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/professional', professionalRoutes);
app.use('/api/phone', phoneRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/timesheets', timesheetRoutes);
app.use('/api/plans', planRoutes);

app.use(errorHandler);

export default app;
