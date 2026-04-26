export const email = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  userEmail: process.env.USER_EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
};