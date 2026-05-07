import { ShiftRepository } from './shifts.repository';
import { MESSAGES } from '../../constants';

export const ShiftService = {
  getAllShifts: async () => {
    const shifts = await ShiftRepository.get();
    return {
      message: MESSAGES.SHIFTS_LIST,
      data: shifts,
    };
  },
};
