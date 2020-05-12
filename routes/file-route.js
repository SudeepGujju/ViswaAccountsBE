const router = require('express').Router();
const upload = require('../utils/file-upload')(global.uploadPath);

router.post("/upload", upload.single('record'), function(req, res){

    return res.status(200).send("File received successfully");
});

module.exports = router;