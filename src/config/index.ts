export * from './app.config';
export * from './auth.config';
export * from './email.config';
export * from './stripe.config';
export * from './paypal.config';

// const config = {
//   port: Number(process.env.PORT) || 3000,

//   nodemailer: {
//     host: process.env.HOST,
//     port: Number(process.env.EMAIL_PORT) || 587,
//     email: process.env.EMAIL,
//     password: process.env.PASSWORD,
//     secure: process.env.SECURE === "true",
//   },

//   messagebird: {
//     key: process.env.MESSAGEBIRD_KEY,
//   },

//   stripe: {
//     key: process.env.STRIPE_KEY,
//   },

//   paypal: {
//     clientID: process.env.PAYPAL_ID,
//     clientSecret: process.env.PAYPAL_SECRET,
//   },

//   app: {
//     server: process.env.SERVER_URL,
//     appUrl: process.env.APP_URL,
//     secret: process.env.SECRET,
//   },

//   database: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     dialect: process.env.DB_DIALECT,
//   },
// };

// export default config;
