
const multer = require('multer');
const uploadGallery = require('../../controllers/GalleryController/uploadGallery');
const fs = require('fs-extra');
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Solo se permiten archivos JPG, JPEG y PNG'));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files');

const uploadGalleryHandler = async (req, res) => {
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
      await uploadGallery(description, companyId, files);
      res.status(200).json({ message: 'Gallery uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = uploadGalleryHandler;