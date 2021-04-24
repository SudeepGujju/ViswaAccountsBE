const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

//Use this function to generate private and public key files to use in 
function fnGenerateKeyPairs(){

    const keyPair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    // Create the private key file
    fs.writeFileSync(path.join(__dirname, 'certificates', 'rsa_jwt_private.pem'), keyPair.privateKey);

    // Create the public key file
    fs.writeFileSync(path.join(__dirname, 'certificates', 'rsa_jwt_public.pem'), keyPair.publicKey);
}

fnGenerateKeyPairs();