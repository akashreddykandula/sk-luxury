const cloudinary = require('../config/cloudinary');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

exports.uploadMiddleware = upload.array('images', 10);
exports.singleUploadMiddleware = upload.single('image');

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `sk-luxury/${folder}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

exports.uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const folder = req.query.folder || 'products';
  const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
  const results = await Promise.all(uploadPromises);

  const images = results.map(r => ({
    url: r.secure_url,
    publicId: r.public_id
  }));

  res.json({ success: true, images });
};

exports.uploadSingleImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const folder = req.query.folder || 'general';
  const result = await uploadToCloudinary(req.file.buffer, folder);
  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
};

exports.deleteImage = async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: 'Public ID required' });
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted' });
};
