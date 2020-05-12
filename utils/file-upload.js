const multer = require('multer');

module.exports = function (vDestPath) {

    if(!vDestPath)
        vDestPath = global.tempPath;

    var diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, vDestPath);
        },
        filename: function (req, file, cb) {
            // console.log(file);
            cb(null, file.originalname + "");
        }
    });

    return multer({
        storage: diskStorage,
        // fileFilter: fileFilter,
        limits: {
            fileSize: 5000 * 1024
        }
    });

}