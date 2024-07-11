const { CertificationGallery } = require('../../db');
const { handleUploadPdfAndImages } = require('../../middlewares/cloudinaryService');

const path = require('path');

const uploadCertification = async (description, companyId, files) => {
 
  try {
    const existingCertificationCount = await CertificationGallery.count({ where: { companyId }});
    // Si ya hay 4 o más Certificaciones/Homologaciones
    if (existingCertificationCount >= 4) {
      throw new Error('No se pueden subir más de 4 Certificaciones/Homologaciones por compañía.');
    }

    // Calcular cuántas Certificaciones/Homologaciones se pueden subir
    const remainingSlots = 4 - existingCertificationCount;
   const filesToUpload = files.slice(0, remainingSlots);

    for (const file of filesToUpload) {    
      
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const fileType = fileExtension === '.pdf' ? '.pdf' : 'image';
    
      const uploadedCertification = await handleUploadPdfAndImages(file.buffer, fileType);
 
      await CertificationGallery.create({
        companyId,
        publicId: uploadedCertification.public_id,
        description,
        filesUrl: uploadedCertification.url
      });
    }
} catch (error) {
    throw new Error('Error uploading Certification gallery: ' + error.message);
}
};
module.exports = uploadCertification;