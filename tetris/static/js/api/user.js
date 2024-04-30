
class __userApi extends __baseApi {
    login(params) {
        return this.client.request({ url: 'auth/login', method: 'post', data: params })
    }

    getHistory(params) {
        return this.client.request({ url: 'histroyScore', method: 'get', data: params })
    }

    getRank(params) {
        return this.client.request({ url: 'ranking', method: 'get', data: params })
    }

    uploadScore(params) {
        return this.client.request({ url: 'uploadScore', method: 'post', data: params })
    }

    getUserinfo() {
        return this.client.request({ url: 'users/userInfo', method: 'get'})
    }
}
