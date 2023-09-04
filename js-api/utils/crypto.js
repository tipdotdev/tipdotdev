var CryptoJS = require("crypto-js");

function generateKey() {
    return CryptoJS.lib.WordArray.random(256/8).toString();
}

function generateUploadKey() {
    // return a base64 key that is 128 characters long
    return CryptoJS.lib.WordArray.random(16).toString();
}

function generateUUID() {
    let uuid = `user_${crypto.randomUUID()}`
    return uuid
}

function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data.toString(), key).toString();
}

function encryptObj(obj, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), key).toString();
}

function decrypt(data, key) {
    var bytes  = CryptoJS.AES.decrypt(data, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);   
    return originalText;
}

function decryptObj(data, key) {
    var bytes  = CryptoJS.AES.decrypt(data, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);   
    return JSON.parse(originalText);
}

module.exports = {
    generateKey,
    generateUploadKey,
    generateUUID,
    encrypt,
    decrypt,
    encryptObj,
    decryptObj
}