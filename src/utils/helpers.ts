export const isActivationLinkExpired = (expiresAt?: Date | null): boolean => {
  if (!expiresAt) return true;

  const now = new Date();

  return now > expiresAt;
};