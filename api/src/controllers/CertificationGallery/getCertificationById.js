const { CertificationGallery } = require('../../db');

const getCertificationById = async(id) => {
    try {
        const files = await CertificationGallery.findOne({
           where: { id },
           attributes: { exclude: ['createdAt', 'updatedAt', 'CompanyId'] }
           });
       return files;
      } catch (error) {
        throw new Error('Error al obtener las certificaciones/homologaciones de la compañía.: ' + error.message);
      }
}
module.exports = {getCertificationById};
