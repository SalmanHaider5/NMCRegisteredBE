import {
  CreateProfessionalDTO,
  ProfessionalPayload,
  ProfessionalFiles,
} from './professional.types';

export function mapCreateProfessionalDTO(
  userId: number,
  body: ProfessionalPayload,
  files: ProfessionalFiles,
): CreateProfessionalDTO {
  return {
    userId,
    fullName: body.fullName,
    dateOfBirth: new Date(body.dateOfBirth),
    postCode: body.postCode,
    address: body.address,
    city: body.city ?? null,
    county: body.county ?? null,
    nmcPin: body.nmcPin,
    qualification: body.qualification ?? null,
    experience: body.experience ?? null,
    status: (body.status as 'PENDING' | 'ACTIVE' | 'INACTIVE') ?? 'PENDING',
    profilePicture: files.profilePicture?.[0]?.path ?? null,
    document: files.document?.[0]?.path ?? null,
    crbDocument: files.crbDocument?.[0]?.path ?? null,
  };
}
