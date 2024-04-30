
axios.defaults.headers.post['Content-Type'] = 'application/json'
class httpClient {
    constructor(baseURL) {
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 1000 * 30,
        })
        this.interceptors(); // 注册中间件

        // 注册用户接口
        this.userApi = new __userApi(this.client);
    }

    interceptors() {
        // 注册中间件
        this.client.interceptors.request.use(
            (config) => {
                config.headers['Authorization'] = 'bearer ' + Store.tokenInfo?.token
                config.data = config.data || {}
                return config
            },
            (err) => {
                console.log('request err:', err)
                return Promise.reject(err)
            }
        )

        this.client.interceptors.response.use(
            (res) => {
                const { data } = res
                if (data.code === 200) {
                    return Promise.resolve(data)
                } else {
                    return Promise.reject(data)
                }
            },
            (err) => {
                return Promise.reject(err)
            }
        )
    }
}

let http = new httpClient("http://175.178.3.148:9090/api/v1")
