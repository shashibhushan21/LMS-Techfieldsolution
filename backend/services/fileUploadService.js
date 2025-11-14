const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Upload file to Cloudinary
 * @param {Object} file - File object from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<String>} - Cloudinary file URL
 */
exports.uploadToCloudinary = async (file, folder = 'uploads') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${process.env.CLOUDINARY_FOLDER || 'lms'}/${folder}`,
          resource_type: 'auto',
          public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            reject(new Error('File upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} fileUrl - Cloudinary file URL
 * @returns {Promise<Boolean>}
 */
exports.deleteFromCloudinary = async (fileUrl) => {
  try {
    // Extract public_id from URL
    const urlParts = fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1].split('.')[0];
    const folder = urlParts.slice(urlParts.indexOf(process.env.CLOUDINARY_FOLDER || 'lms'), -1).join('/');
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file objects from multer
 * @param {String} folder - Cloudinary folder path
 * @returns {Promise<Array>} - Array of Cloudinary file URLs
 */
exports.uploadMultipleToCloudinary = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map(file => this.uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple Cloudinary Upload Error:', error);
    throw new Error('Multiple file upload failed');
  }
};

/**
 * Get signed URL for private Cloudinary resources
 * @param {String} publicId - Cloudinary public ID
 * @param {Number} expiresIn - URL expiration time in seconds
 * @returns {String} - Signed URL
 */
exports.getSignedUrl = (publicId, expiresIn = 3600) => {
  const timestamp = Math.round(Date.now() / 1000) + expiresIn;
  
  return cloudinary.utils.private_download_url(publicId, 'auto', {
    expires_at: timestamp,
    attachment: false
  });
};
