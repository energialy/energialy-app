const { CertificationGallery } = require('../../db');

const { getAllCertification } = require('../../controllers/CertificationGallery/getAllCertification');
const { getCertificationById } = require('../../controllers/CertificationGallery/getCertificationById');


const allCertificationHandler = async (req, res) => {
    const { id } = req.params;

    try {
        if (await isCompanyId(id)) {
            const results = await getAllCertification(id);
            res.status(200).json(results);
        } else {
            const certificationById = await getCertificationById(id);
            res.status(200).json(certificationById);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const isCompanyId = async (id) => {
    const companyExists = await CertificationGallery.findOne({
        where: { companyId: id },
    });
    return !!companyExists; // Devuelve true si existe una compañía con ese ID, false en caso contrario
};

module.exports = allCertificationHandler;