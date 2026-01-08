// Author: -GLOBENXCC-
// OS support: Windows, Linux, macOS
// Description: Cloudinary configuration and image upload helper

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: 'anchorone/avatars',
            resource_type: 'image',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ],
            ...options
        };

        cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        }).end(buffer);
    });
};

const deleteImage = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage
};

// --- End of cloudinary.js ---
