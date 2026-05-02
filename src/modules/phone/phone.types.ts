export type AddPhoneRequest = {
  phone: string;
};

export type PhoneRequestPayload = {
  userId: number;
  phone: string;
};

export type VerifyPhoneRequestPayload = {
  userId: number;
  code: string;
};

export type PhoneServiceResponse = {
  message: string;
  data: unknown;
};

export type GenerateOTPPayload = {
  userId: number;
};
