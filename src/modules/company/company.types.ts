export type CompanyPayload = {
  userId: number;
  firstName: string;
  lastName: string;
  organization: string;
  tradingName?: string;
  address: string;
  city: string;
  county?: string;
  postalCode: string;
  website?: string;
  phone: string;
  registration?: string;
  charity?: boolean;
  charityReg?: string;
  subsidiary?: boolean;
  subsidiaryName?: string;
  subsidiaryAddress?: string;
};

export type UpdateCompanyPayload = Partial<CompanyPayload>;
