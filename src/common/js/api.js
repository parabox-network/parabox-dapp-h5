import axios from 'axios';
// axios.defaults.baseURL = "/api";
axios.defaults.baseURL = "http://47.92.33.78:8060";


// http://192.168.1.200:8060/query/block/getByAccountData
//http://192.168.1.200:8060/query/block/getTransactionsByCondition
export function getTransactionInfo(data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: '/query/block/getTransactionsByCondition',
            data: data
        }).then((response) => {
            if (response.status === 200 && response.data) {
                resolve(response.data);
            } else {
                reject(response.data)
            }
        }).catch((response) => {
            reject(response.message);
        })
    })
}

export function getTransactions(data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: '/query/block/getByAccountData',
            data: data
        }).then((response) => {
            if (response.status === 200 && response.data) {
                resolve(response.data);
            } else {
                reject(response.data)
            }
        }).catch((response) => {
            reject(response.message);
        })
    })
}

export function getDapps() {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: '/backstage/dapp/getAllDapps',
            params: {}
        }).then((response) => {
            if (response.status === 200 && response.data) {
                resolve(response.data);
            } else {
                reject(response.data)
            }
        }).catch((response) => {
            reject(response.message);
        })
    })
}

export function getBanners() {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: '/backstage/banner/getAllBanners',
            params: {}
        }).then((response) => {
            if (response.status === 200 && response.data) {
                resolve(response.data);
            } else {
                reject(response.data)
            }
        }).catch((response) => {
            reject(response.message);
        })
    })
}