import { Request } from 'express';

export type ProfessionalPayload = {
  fullName: string;
  dateOfBirth: Date;
  postCode: string;
  address: string;
  city?: string;
  county?: string;
  nmcPin: string;
  qualification?: string;
  experience?: string;
  status?: string;
};

export type UpdateProfessionalBody = Partial<ProfessionalPayload>;

export type PhoneBody = {
  phone: string;
};

export type VerifyPhoneBody = {
  otp: string;
};

export type SecurityBody = {
  enable2FA: boolean;
  otp: string;
};

export type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type ProfessionalFiles = {
  profilePicture?: UploadedFile[];
  document?: UploadedFile[];
  crbDocument?: UploadedFile[];
};

export type CreateProfessionalRequest = {
  body: ProfessionalPayload;
  files: ProfessionalFiles;
};

export type RequestWithUserId<T> = Request<{ userId: string }, unknown, T>;

export type CreateProfessionalDTO = {
  userId: number;

  fullName: string;
  dateOfBirth: Date;
  postCode: string;
  address: string;

  city: string | null;
  county: string | null;

  nmcPin: string;
  qualification: string | null;
  experience: string | null;

  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';

  profilePicture: string | null;
  document: string | null;
  crbDocument: string | null;
};

export type Toggle2FAPayload = {
  userId: number;
  twoFactorAuthentication: boolean;
};

export type SearchProfessionalsPayload = {
  page: number;
  limit: number;
  qualification?: string;
};
