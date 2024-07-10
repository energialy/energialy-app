const updateCertification = require('../../controllers/CertificationGallery/putCertification');

const updateCertificationHandler = async (req, res) => {
    try {
        const { id } = req.params;   
        const {description} = req.body;
          
        const resultUpdateProject = await updateCertification(id, description);
        res.status(200).json(resultUpdateProject)
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
};

module.exports = updateCertificationHandler;