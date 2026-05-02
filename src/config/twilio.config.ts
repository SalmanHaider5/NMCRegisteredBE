import twilio from 'twilio';

export const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
