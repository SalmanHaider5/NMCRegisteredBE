import { STATUSES } from '../../constants';
import { CreateOfferPayload } from './offer.types';

export const mapOfferPayload = (
  data: CreateOfferPayload,
  companyId: number,
) => {
  return {
    companyId,
    professionalId: data.professionalId,
    shiftRate: data.shiftRate,
    address: data.address,
    shifts: data.shifts,
    message: data.message,
    professionalMsg: data.professionalMsg,
    status: STATUSES.PENDING,
  };
};
