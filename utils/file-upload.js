const multer = require('multer');

module.exports = function (vDestPath, vUseRandFileName=false) {

    if(!vDestPath)
        vDestPath = global.tempPath;

    let filename = null;
    
    if(!vUseRandFileName)
    {
        filename = function (req, file, cb) {
            cb(null, file.originalname);
        }
    }

    var diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, vDestPath);
        },
        filename: filename
    });

    return multer({
        storage: diskStorage,
        // fileFilter: fileFilter,
        limits: {
            fileSize: 5000 * 1024
        }
    });

}