import nodemailer from 'nodemailer';
import { email, app } from '../../config';

const env = app.env || 'development';
const emailConfig = env === 'development' ?
  {
    service: 'gmail',
    auth: {
      user: email.userEmail,
      pass: email.emailPassword,
    }
  } :
  {
    host: email.host,
    port: email.port,
    secure: false,
    auth: {
      user: email.userEmail,
      pass: email.emailPassword,
    }
  };

export const transporter = nodemailer.createTransport(emailConfig);