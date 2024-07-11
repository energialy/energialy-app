const { CertificationGallery } = require('../../db');

const getAllCertification = async(companyId) => {
 
    try {
      const certificationAllCompany = await CertificationGallery.findAll({
         where: { companyId },
         attributes: { exclude: ['createdAt', 'updatedAt', 'CompanyId'] }
        });
       
      return (certificationAllCompany);
    } catch (error) {
      throw new Error('Error al obtener las certificaciones/homologaciones de la compañía.: ' + error.message);
    }
}
module.exports = {getAllCertification};

