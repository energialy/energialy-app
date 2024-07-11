const multer = require('multer');
const uploadCertification = require('../../controllers/CertificationGallery/postCertification');
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
 
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    return cb(new Error('Solo se permiten archivos JPG, JPEG, PNG y PDF'));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files');

const uploadCertificationHandler = async (req, res) => {

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const files = req.files;  
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const { description, companyId } = req.body;   
      await uploadCertification(description, companyId, files);
      res.status(200).json({ message: 'Certification uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = uploadCertificationHandler;