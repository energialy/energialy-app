const { CertificationGallery } = require('../../db');

const updateCertification = async(id, description) => {
    try {
          
    const certificationFound = await CertificationGallery.findByPk(id);
   
    if (!certificationFound) {

        throw new Error('La certificacion/homologacion no fue encontrada');
                }

                certificationFound.description = description;
                await certificationFound.save();
                return certificationFound;

    } catch (error) {
        throw new Error('Failed to update certification: ' + error.message);
    }
}
module.exports = updateCertification;