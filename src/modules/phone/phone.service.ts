import { MESSAGES } from '../../constants';
import { AppError } from '../../utils';
import { PhoneRepository } from './phone.repository';
import {
  PhoneRequestPayload,
  PhoneServiceResponse,
  VerifyPhoneRequestPayload,
  GenerateOTPPayload,
} from './phone.types';
import { generateCode, isCodeExpired } from './phone.helpers';
import { TwilioProvider } from '../../providers/twilio/twilio.provider';

export class PhoneService {
  static async addPhone(
    payload: PhoneRequestPayload,
  ): Promise<PhoneServiceResponse> {
    const { userId, phone } = payload;
    const smsProvider = new TwilioProvider();
    const phoneExisted = await PhoneRepository.findByUserId(userId);
    if (phoneExisted) {
      if (phoneExisted.status) {
        throw new AppError(MESSAGES.PHONE_VERIFIED, 409);
      }
      const code = generateCode();
      const result = await PhoneRepository.updateById(phoneExisted.id, {
        phone,
        code,
      });
      await smsProvider.send(phone, code);
      return {
        message: MESSAGES.OTP_SENT,
        data: result,
      };
    }
    const used = await PhoneRepository.findVerifiedPhone(phone);
    if (used) {
      throw new AppError(MESSAGES.PHONE_IN_USE, 409);
    }
    const code = generateCode();
    const response = await PhoneRepository.create({
      userId,
      phone,
      code,
      status: false,
    });
    await smsProvider.send(phone, code);
    return {
      message: MESSAGES.OTP_SENT,
      data: { phone: response.phone, status: response.status },
    };
  }

  static async verifyPhone(
    payload: VerifyPhoneRequestPayload,
  ): Promise<PhoneServiceResponse> {
    const { userId, code: reqCode } = payload;
    const response = await PhoneRepository.findByUserId(userId);

    if (!response) {
      throw new AppError(MESSAGES.PHONE_NOT_FOUND, 404);
    }

    const { code, updatedAt, status } = response;

    if (code !== reqCode) {
      throw new AppError(MESSAGES.INAVLID_CODE, 400);
    }

    if (status) {
      return {
        data: {},
        message: MESSAGES.PHONE_VERIFIED,
      };
    }

    if (isCodeExpired(updatedAt)) {
      throw new AppError(MESSAGES.INAVLID_CODE, 400);
    }
    const body = { status: true };
    const result = await PhoneRepository.updateByUserId(userId, body);

    return {
      message: MESSAGES.PHONE_VERIFIED_SUCCESS,
      data: { phone: result.phone, status: result.status },
    };
  }

  static async updatePhone(
    payload: PhoneRequestPayload,
  ): Promise<PhoneServiceResponse> {
    const smsProvider = new TwilioProvider();
    const { userId, phone } = payload;
    const existingPhone = await PhoneRepository.findByUserId(userId);
    if (!existingPhone) {
      throw new AppError(MESSAGES.PHONE_NOT_FOUND, 400);
    }

    const used = await PhoneRepository.findVerifiedPhone(phone);
    if (used && used.userId !== userId) {
      throw new AppError(MESSAGES.PHONE_IN_USE, 400);
    }
    const code = generateCode();
    const response = await PhoneRepository.updateByUserId(userId, {
      phone,
      code,
      status: false,
    });
    await smsProvider.send(phone, code);
    return {
      message: MESSAGES.OTP_SENT,
      data: {
        phone: response?.phone,
        status: response?.status,
      },
    };
  }

  static async generateOTP(
    payload: GenerateOTPPayload,
  ): Promise<PhoneServiceResponse> {
    const smsProvider = new TwilioProvider();
    const { userId } = payload;
    const record = await PhoneRepository.findByUserId(userId);
    if (record) {
      const status = record.status as boolean;
      if (status) {
        const code = generateCode();
        await PhoneRepository.updateByUserId(userId, { code });
        const phone = record.phone as string;
        await smsProvider.send(phone, code);
        return {
          message: MESSAGES.OTP_SENT,
          data: {},
        };
      }
    }
    throw new AppError(MESSAGES.PHONE_NOT_VERIFIED);
  }
}
