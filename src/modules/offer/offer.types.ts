export type CreateOfferPayload = {
  professionalId: number;
  shiftRate?: number;
  address?: string;
  shifts?: string;
  message?: string;
  professionalMsg?: string;
};

export type CreateOfferDTO = {
  companyId: number;
  professionalId: number;
  shiftRate?: number;
  address?: string;
  shifts?: string;
  message?: string;
  professionalMsg?: string;
};

export type UpdateOfferPayload = {
  offerId: number;
  status: string;
};
