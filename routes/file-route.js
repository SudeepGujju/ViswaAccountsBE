const router = require('express').Router();

const { FileFormats, UploadMiddleware } = require('../utils/file-upload');

const uploadConfig = { DestinationPath: global.uploadPath, UploadFileToUserFolder: true, UseOriginalFileName: true, AllowedFileFormats: [FileFormats.CSV, FileFormats.XLS] };
const upload = UploadMiddleware(uploadConfig);

router.post("/upload", upload.single('record'), async function(req, res){

    return res.status(200).send("File received successfully");
});

module.exports = router;