import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class UserRepository {

  static findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static findById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data
    });
  }

  static updateUserByEmail(email: string, data: Partial<Prisma.UserUpdateInput>) {
    return prisma.user.update({
      where: { email },
      data
    });
  }

  static updateUserById(id: number, data: Partial<Prisma.UserUpdateInput>) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static verifyUser(id: number) {
    return prisma.user.update({
      where: { id },
      data: {
        isVerified: true
      }
    });
  }

  static findUserWithProfile(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        professional: true,
        company: true,
        phones: true,
        payments: true,
        locationHistory: true
      }
    });
  }

  static findUserByIdWithRelations(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        professional: true,
        company: true,
        phones: true,
        payments: true,
        locationHistory: true
      }
    });
  }

  static updatePassword(id: number, hashedPassword: string) {
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });
  }

  static updateEmail(id: number, email: string) {
    return prisma.user.update({
      where: { id },
      data: {
        email
      }
    });
  }

  static deleteUser(id: number) {
    return prisma.user.delete({
      where: { id }
    });
  }
}