const deleteCertification = require('../../controllers/CertificationGallery/deleteCertification');

const deleteCertificationHandler = async (req, res) => {
    const { id } = req.params;
    try { 
        const result = await deleteCertification(id);
     res.status(200).json({message: "Certificacion/Homologacion eliminada"} );
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
};

module.exports = deleteCertificationHandler;