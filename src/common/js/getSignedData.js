import cita from './cita';
// import {getPrivateKeyFromKeystore} from './keyMnemonic';
import { getStorage } from './storage';
import { getPrivateKey } from './Keythereum';
import { bigNumberNumFixed } from './bignumber';
import { Toast } from 'vant';

export async function getPrivate(password) {
    let keyStore = getStorage("ticketKeystore");
    let data = {
        password: password,
        keyStore: JSON.parse(keyStore)
    }
    let key = await getPrivateKey(data);
    return key;
}

export async function signTransaction(address, password, value, to, data) {
    console.log(address);
    console.log(password);
    console.log(value);
    console.log(to);
    console.log(data);
    try {
        let privateKey = await getPrivate(password);
        let nonce = await cita.base.getTransactionCount(address);
        let amount = bigNumberNumFixed(value);
        // amount = amount.toString()
        amount = await cita.utils.toBN(amount).toString(16);
        // let amount = await cita.utils.toBN(value).toString(16);
        let metaData = await cita.base.getMetaData();
        let blockNumber = await cita.base.getBlockNumber();
        let TransactionData = {
            privateKey: '0x' + privateKey,
            value: "0x" + amount,
            to: to,
            quota: 2000000,
            nonce: cita.utils.toHex(nonce),
            data: data && data !== '' ? data : '',
            chainId: metaData.chainIdV1,
            version: metaData.version,
            validUntilBlock: blockNumber + 88
        }

        console.log(TransactionData)
        let signData = await cita.base.signer(TransactionData);
        return signData;
    } catch (error) {
        Toast(error.message);
        return;
    }
}