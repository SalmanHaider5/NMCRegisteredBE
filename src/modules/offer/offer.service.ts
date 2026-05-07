import { OfferRepository } from './offer.repository';
import { CreateOfferPayload, UpdateOfferPayload } from './offer.types';
import { TwilioProvider } from '../../providers/twilio/twilio.provider';
import { OFFER_MESSAGES } from './offer.constants';
import { mapOfferPayload } from './offer.mapper';
import { PhoneRepository } from '../phone/phone.repository';
import { ProfessionalRepository } from '../professional/professional.repository';
import { MESSAGES } from '../../constants';
import { AppError } from '../../utils';
import { CompanyRepository } from '../company/company.repository';

export class OfferService {
  static async createOffer(userId: number, data: CreateOfferPayload) {
    const smsProvider = new TwilioProvider();
    const company = await CompanyRepository.findByUserId(userId);
    if (!company) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const payload = mapOfferPayload(data, company.id);
    const professional = await ProfessionalRepository.findByIdForOffer(
      data.professionalId,
    );
    if (!professional) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const offer = await OfferRepository.create(payload);
    const phoneRecord = await PhoneRepository.findByUserId(
      professional?.userId,
    );
    const message = OFFER_MESSAGES.NEW_OFFER;
    const phone = phoneRecord?.phone as string;
    await smsProvider.send(phone, message);
    return {
      message: MESSAGES.OFFER_CREATED,
      data: {
        ...offer,
        ...professional,
      },
    };
  }
  static async updateOfferByCompany(payload: UpdateOfferPayload) {
    const smsProvider = new TwilioProvider();
    const { offerId, status } = payload;
    const offer = await OfferRepository.update(offerId, status);
    const professional = await ProfessionalRepository.findByIdForOffer(
      offer.professionalId,
    );
    if (!professional) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const phoneRecord = await PhoneRepository.findByUserId(
      professional?.userId,
    );
    const message =
      status === 'approved'
        ? OFFER_MESSAGES.OFFER_APPROVED
        : OFFER_MESSAGES.OFFER_REJECTED;
    const phone = phoneRecord?.phone as string;
    await smsProvider.send(phone, message);
    return {
      message: MESSAGES.OFFER_UPDATED,
      data: {
        ...offer,
        ...professional,
      },
    };
  }
  static async updateOfferByProfessional(payload: UpdateOfferPayload) {
    const smsProvider = new TwilioProvider();
    const { offerId, status } = payload;
    const offer = await OfferRepository.update(offerId, status);
    const company = await CompanyRepository.findById(offer.companyId);
    if (!company) {
      throw new AppError(MESSAGES.INVALID_REQUEST, 400);
    }
    const phone = company?.phone as string;
    const message =
      status === 'approved'
        ? OFFER_MESSAGES.OFFER_ACCEPTED
        : OFFER_MESSAGES.OFFER_DECLINED;
    await smsProvider.send(phone, message);
    return {
      message: MESSAGES.OFFER_UPDATED,
      data: offer,
    };
  }
}
