import axios from 'axios';
// axios.defaults.baseURL = "/api";

axios.defaults.baseURL = "http://47.92.33.78:8060";

// axios.defaults.baseURL = "http://192.168.1.200:8060";

export function getPrizeList(data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: '/lottery/Lottery/getLotteryStatusInfo',
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

export function getPrizeLevel(data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: '/lottery/Lottery/getHashListInfo',
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

