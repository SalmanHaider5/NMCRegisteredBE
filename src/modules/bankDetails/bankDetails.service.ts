import { BankDetailsRepository } from './bankDetails.repository';
import { AppError } from '../../utils';
import { MESSAGES } from '../../constants';
import {
  BankDetailsPayload,
  UpdateBankDetailsPayload,
} from './bankDetails.types';

export class BankDetailsService {
  static async addBankDetails(payload: BankDetailsPayload) {
    const { userId } = payload;
    const existing = await BankDetailsRepository.findByUserId(userId);
    if (existing) {
      throw new AppError(MESSAGES.BANK_DETAILS_EXISTED, 409);
    }
    const bankDetails = await BankDetailsRepository.create(payload);
    return {
      message: MESSAGES.BANK_DETAILS_ADDED,
      data: bankDetails,
    };
  }

  static async updateBankDetails(
    userId: number,
    data: UpdateBankDetailsPayload,
  ) {
    await BankDetailsRepository.updateByUserId(userId, data);
    return {
      message: MESSAGES.BANK_DETAILS_UPDATED,
      data,
    };
  }
}
