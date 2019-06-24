let baseURL
// 开发环境
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://192.168.1.120:8100/'
// 编译环境
} else {
    // 测试环境
    if (process.env.TYPE === 'test') {
        baseURL = 'http://test.xxx.com/'
    // 正式环境
    } else {
        baseURL = 'http://app.xxx.com/'
    }
}
module.exports = baseURL;