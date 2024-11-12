const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer ({ storage,
    fileFilter: (req, file, cb) => {
        const filetypes= /jpeg|jpg|png/;
        const mimetype= filetypes.test(file.mimetype);
        const extname= filetypes.test(file.originalname.split('.').pop().toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb (new Error('Only jpg, jpeg, png files are allowed...'));
    }
 }).array('images', 20);

module.exports = upload;