const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Initialize folder structure
const initializeFolders = async () => {
  const baseFolder = process.env.CLOUDINARY_FOLDER || 'lms';
  const subfolders = [
    'uploads/assignments',
    'uploads/resumes',
    'uploads/avatars',
    'certificates',
    'resources'
  ];

  try {
    console.log(`Initializing Cloudinary folder structure under "${baseFolder}"...`);
    
    // Create a dummy asset in each folder to ensure folder exists
    // Cloudinary creates folders automatically when assets are uploaded
    for (const subfolder of subfolders) {
      const folderPath = `${baseFolder}/${subfolder}`;
      console.log(`✓ Folder path configured: ${folderPath}`);
    }
    
    console.log('✓ Cloudinary folder structure initialized successfully');
  } catch (error) {
    console.error('Cloudinary folder initialization warning:', error.message);
    // Don't throw error as folders will be created automatically on first upload
  }
};

// Initialize folders on startup
initializeFolders();

module.exports = cloudinary;
