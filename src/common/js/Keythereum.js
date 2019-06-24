const keythereum = require("keythereum");

export function createAccount(pwd, privateKey) {
    return new Promise((resolve, reject) => {
        try {
            let params = { keyBytes: 32, ivBytes: 16 };
            let privateBuf = Buffer.from(privateKey, 'hex');
            let dk = keythereum.create(params);
            let options = {
                kdf: "scrypt",
                cipher: "aes-128-ctr",
                kdfparams: {
                    n: 262144,
                    r: 8,
                    p: 1,
                    dklen: 32
                }
            };
            let keyObject = keythereum.dump(pwd, privateBuf, dk.salt, dk.iv, options);
            resolve(keyObject);
        } catch (error) {
            reject(error);
        }

    });
}

export function getPrivateKey(data) {
    return new Promise((resolve, reject) => {
        let privateKey = keythereum.recover(data.password, data.keyStore).toString('hex');
        resolve(privateKey);
    });
}