const { getCertificationCount } = require('../../controllers/CertificationGallery/getCertificationCount');

const getCountCertification = async (req, res) => {
    const { companyId } = req.params;
    try {
      
        if (companyId) {          
            const count = await getCertificationCount(companyId);
            res.status(200).json(count);
        } else {
            res.status(404).json({ error: 'Company not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al obtener el número de certificaciones/homologaciones' });
    }
};

module.exports = getCountCertification;