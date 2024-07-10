const { CertificationGallery } = require('../../db');
const cloudinaryService = require('../../middlewares/cloudinaryService');

const deleteCertification = async(id) => {
    try {
        const certificationFound = await CertificationGallery.findByPk(id);
        if( !certificationFound ) {
            throw new Error('Certification not found');
        }
        const deletedCertification = await CertificationGallery.destroy({
            where: {
                id
            },
            //force: true,
            
        });
        await cloudinaryService.deleteImageFromCloudinary(certificationFound.publicId);

        return deletedCertification;

    } catch (error) {
        throw new Error('Failed to delete certification/homologation: ' + error.message);
    }
}
module.exports = deleteCertification;