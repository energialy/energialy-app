const path = require('path');
 const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});
// subir un solo archivo
const handleUpload = async (fileBuffer) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
          reject(new Error('Error al cargar la imagen a Cloudinary: ' + error.message));
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url 
          });
        }
      }).end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Error al cargar la imagen a Cloudinary: ' + error.message);
  }
};
//subir varios archivos
const handleUploadFiles = async (files) => {
  try {
    const promises = files.map((file) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(file.buffer);
      })
    );

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw new Error('Error al cargar las imágenes a Cloudinary: ' + error.message);
  }
};

const updateUpload = async (file) => {
  await cloudinary.uploader.upload(file.path, {
    public_id: image.public_id,
    overwrite: true,
  });
};

const deleteImageFromCloudinary = async (id) => {
  try {
  
    const result = await cloudinary.uploader.destroy(id);

    if (result.result === 'ok') {
      
    } else {
     
    }
  } catch (error) {
    console.error('Error al eliminar la imagen de Cloudinary:', error.message);
  }
};

const getAllImagesFromCloudinary = async () => {
  try {
    const result = await cloudinary.search
      .expression('resource_type:image OR resource_type:raw')
      .execute();

    const resultAll = result.resources.map((resource) => {
      const isPdf = resource.format === 'pdf';
      return {
        asset_id: resource.asset_id,
        public_id: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at,
        type: isPdf ? 'pdf' : 'image'
      };
    });

    return resultAll;
  } catch (error) {
    console.error(
      'Error al obtener las imágenes de Cloudinary:',
      error.message
    );
    return [];
  }
};

const handleUploadPdfAndImages = async (fileBuffer, fileType,originalname) => {
 
  try {
    const resourceType = fileType === 'pdf' ? 'raw' : 'auto';

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({   resource_type: resourceType,
        // public_id: originalname.replace(/\.[^/.]+$/, ""),
       }, (error, result) => {
        if (error) {
          reject(new Error('Error al cargar el archivo a Cloudinary: ' + error.message));
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }).end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Error al cargar el archivo a Cloudinary: ' + error.message);
  }
};

module.exports = {
  getAllImagesFromCloudinary,
  deleteImageFromCloudinary,
  handleUpload,
  handleUploadFiles,
  updateUpload,
  handleUploadPdfAndImages,
};