const { CertificationGallery } = require('../../db'); 

// Controlador para obtener el número de imágenes actuales de una compañía
const getCertificationCount = async (companyId) => {
  try {
    const count = await CertificationGallery.count({ where: { companyId } });
   return count
  } catch (error) {
    throw new Error('Error al obtener el número de certificaciones/homologaciones: ' + error.message);
  }
};

module.exports = { getCertificationCount };