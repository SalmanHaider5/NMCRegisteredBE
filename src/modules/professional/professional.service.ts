import { MESSAGES } from '../../constants';
import { AppError } from '../../utils';
import { ProfessionalRepository } from './professional.repository';
import { mapCreateProfessionalDTO } from './professional.mapper';
import {
  ProfessionalFiles,
  ProfessionalPayload,
  Toggle2FAPayload,
  UpdateProfessionalBody,
  SearchProfessionalsPayload,
} from './professional.types';

export class ProfessionalService {
  static async createProfessional(
    userId: number,
    body: ProfessionalPayload,
    files: ProfessionalFiles,
  ) {
    const user = await ProfessionalRepository.findByUserId(userId);
    if (user) {
      throw new AppError(MESSAGES.PROFILE_EXISTS, 409);
    }
    const payload = mapCreateProfessionalDTO(userId, body, files);
    const profile = await ProfessionalRepository.create(payload);
    return {
      message: MESSAGES.PROFILE_CREATED,
      data: profile,
    };
  }

  static async toggle2FA(payload: Toggle2FAPayload) {
    const { userId, twoFactorAuthentication } = payload;
    const user = await ProfessionalRepository.findByUserId(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, 400);
    }
    await ProfessionalRepository.update(userId, { twoFactorAuthentication });
    return {
      message: MESSAGES.TWO_FA_TOGGLED,
      data: { twoFactorAuthentication },
    };
  }

  static async updateProfile(userId: number, body: UpdateProfessionalBody) {
    await ProfessionalRepository.update(userId, body);
    return {
      message: MESSAGES.PROFILE_UPDATED,
      data: body,
    };
  }

  static async searchProfiles(payload: SearchProfessionalsPayload) {
    const { page, limit, qualification } = payload;
    const professionals = await ProfessionalRepository.findByQualification(
      page,
      limit,
      qualification,
    );
    return {
      message: MESSAGES.PROFESSIONALS_LIST,
      data: {
        count: professionals.length,
        professionals,
      },
    };
  }
}
