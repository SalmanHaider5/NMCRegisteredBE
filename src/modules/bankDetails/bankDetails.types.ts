export type BankDetailsPayload = {
  userId: number;
  accountNumber: string;
  sortCode?: string;
  insurance?: string;
};

export type UpdateBankDetailsPayload = Partial<BankDetailsPayload>;
