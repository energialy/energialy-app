const { CompanyGallery } = require('../../db');
const { handleUpload } = require('../../middlewares/cloudinaryService');

const uploadGallery = async (description, companyId, files) => {
  try {

    const existingImagesCount = await CompanyGallery.count({ where: { companyId }});
    // Si ya hay 4 o más imágenes
    if (existingImagesCount >= 4) {
      throw new Error('No se pueden subir más de 4 imágenes por compañía.');
    }

    // Calcular cuántas imágenes se pueden subir
    const remainingSlots = 4 - existingImagesCount;
   const filesToUpload = files.slice(0, remainingSlots);

    for (const file of filesToUpload) {    
      const uploadedImage = await handleUpload(file.buffer);
      await CompanyGallery.create({
        companyId,
        publicId: uploadedImage.public_id,
        description,
        imageUrl: uploadedImage.url
      });
    }
} catch (error) {
    throw new Error('Error uploading gallery: ' + error.message);
}
};
module.exports = uploadGallery;
