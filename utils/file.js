const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const csv = require('csv-parser');

const fsReadDir = promisify(fs.readdir);
const fsFilesExist = promisify(fs.exists);
const fsDeleteFile = promisify(fs.unlink);

module.exports.getFilesList = function(){

    return fsReadDir(path.join(__dirname,"../uploads"));

}

module.exports.isFileExists = function(filename){

    return fsFilesExist(path.join(__dirname,"../uploads/",filename));

}

module.exports.deleteFile = function(filePath){

    return fsDeleteFile(filePath);

}

module.exports.readCSVFile = function(filePath){

    return new Promise(function(resolve, reject){

        if(!fs.existsSync(filePath))
        {
            reject(new Error(filePath + " - File does not exists"));
            return false;
        }

        let results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data)=> results.push(data))
            .on('end', ()=>{
                resolve(results);
            })
            .on('error', reject);

    });
}
