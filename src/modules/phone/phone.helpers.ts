export const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isCodeExpired = (updatedAt: Date, minutes = 5): boolean => {
  const now = new Date().getTime();
  const updated = new Date(updatedAt).getTime();
  const diff = (now - updated) / 1000 / 60;
  return diff > minutes;
};
