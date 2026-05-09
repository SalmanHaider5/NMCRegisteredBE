import { createUploader } from './multer.config';

const upload = createUploader('professionals');
export const uploadProfessionalFiles = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
]);
