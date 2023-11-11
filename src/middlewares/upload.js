const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
const imgUpload = upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'images', maxCount: 8 }]);

module.exports = imgUpload;