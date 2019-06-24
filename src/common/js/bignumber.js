const BigNumber = require('bignumber.js');
const Ether = new BigNumber(10e+17);
const EtherFixed = new BigNumber(10e-19); //10*10^(-19)

export function bigNumberNum(amount) {
    let ret = new BigNumber(amount.toString());
    return ret.dividedBy(Ether).toFixed(3);
}

// 无四舍五入保留四位小数
export function bigNumberNumFloorTo4(amount) {
    let ret = new BigNumber(amount.toString());
    return (Math.floor((ret.dividedBy(Ether) * 10000)) / 10000).toFixed(4);
}

export function bigNumberNumFixed(amount) {
    let ret = new BigNumber(amount.toString());
    return ret.dividedBy(EtherFixed);
}