const CryptoJS = require('crypto-js')

const key = CryptoJS.enc.Utf8.parse('path')

export function decryptAES(word) {
    const decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding:  CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
