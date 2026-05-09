import { prisma } from '../../lib/prisma';
import { CreateOfferDTO } from './offer.types';

export const OfferRepository = {
  create: (data: CreateOfferDTO) => {
    return prisma.offer.create({
      data,
    });
  },
  update: (id: number, status: string) => {
    return prisma.offer.update({
      where: { id },
      data: { status },
    });
  },
};
