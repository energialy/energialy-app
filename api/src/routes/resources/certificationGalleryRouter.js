const { Router } = require('express');

// const uploadGalleryHandler = require("../../handlers/CompanyGallery/uploadGalleryHandler");
// const deleteImage = require("../../handlers/CompanyGallery/deleteImageHandler");
// const updateImage = require("../../handlers/CompanyGallery/updateImageHandler");
// const getAllImages = require("../../handlers/CompanyGallery/getAllImagesHandler");
// const getImageCountHandler = require("../../handlers/CompanyGallery/getImageCountHandler");

const uploadCertificationHandler = require('../../handlers/CertificationGallery/postCertificationHandler');
const deleteCertificationHandler = require('../../handlers/CertificationGallery/deleteCertificationHandler');
const updateCertificationHandler = require('../../handlers/CertificationGallery/putCertificationHandler');
const allCertificationHandler = require('../../handlers/CertificationGallery/getAllCertificationHandler');
const getCountCertification = require('../../handlers/CertificationGallery/getCountCertificationHandler');

 const certificationRouter =Router();

// galleryRouter.post('/files', uploadGalleryHandler);

certificationRouter.post('/files', uploadCertificationHandler);
// galleryRouter.delete('/:id', deleteImage);
certificationRouter.delete('/:id', deleteCertificationHandler);

// galleryRouter.put('/:id', updateImage);
certificationRouter.put('/:id', updateCertificationHandler);

// galleryRouter.get('/:id', getAllImages);
certificationRouter.get('/:id', allCertificationHandler);

// galleryRouter.get('/count/:companyId', getImageCountHandler);
certificationRouter.get('/count/:companyId', getCountCertification);

module.exports = certificationRouter;