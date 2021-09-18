const multer = require('multer');
const { InvalidFileFormatError } = require('./error');
const fs = require('fs');
const path = require('path');

module.exports.UploadMiddleware = function (uploadConfig={}) {

    let vDestinationPath = uploadConfig.DestinationPath || global.tempPath;
    let vUseOriginalFileName = uploadConfig.UseOriginalFileName || true;
    let vAllowedFileFormats = uploadConfig.AllowedFileFormats || [];
    let vUploadFileToUserFolder = uploadConfig.UploadFileToUserFolder || false;

    let filename = null;

    if(vUseOriginalFileName)
    {
        filename = function (req, file, cb) {
            cb(null, file.originalname);
        }
    }

    let diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {

            if(vUploadFileToUserFolder){
                let vFolderPath = path.join(vDestinationPath, req.user.loginID);

                fs.mkdir(vFolderPath, function(err){

                    if(err && err.code != 'EEXIST'){
                        return cb(err);
                    }

                    return cb(null, vFolderPath);
                });

                return;
            }

            return cb(null, vDestinationPath);
        },
        filename: filename
    });

    let fileFilter = function(req, file, cb) {

        if(vAllowedFileFormats.length > 0)
        {
            if( vAllowedFileFormats.indexOf(file.mimetype) == -1 )
            {
                return cb(new InvalidFileFormatError(`Only ${vAllowedFileFormats.join(', ')} files are allowed`));
            }

            cb(null, true);
        }
        else
        {
            cb(null, true);
        }
    };

    return multer({
        storage: diskStorage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5000 * 1024
        }
    });

}

const FileFormats = {
    Text: "text/plain",
    JPG: "image/jpeg",
    PNG: "image/png",
    GIF: "image/gif",
    CSV: "text/csv",
    XLS: "application/vnd.ms-excel" //getting MIME type as -> application/vnd.ms-excel if csv was saved using MS_Excel. So use this File Format along with text/csv for csv file format validation.
}

module.exports.FileFormats = FileFormats;