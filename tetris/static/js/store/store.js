class __store {
    constructor() {
    }

    get tokenInfo() {
        let userinfo = localStorage.getItem("tokenInfo")
        if (userinfo == null) {
            return null
        }
        return JSON.parse(userinfo)
    }

    set tokenInfo(data) {
        localStorage.setItem("tokenInfo",JSON.stringify(data));
        // TODO 校验有效期
    }

    cleanTokenInfo() {
        localStorage.removeItem("tokenInfo")
    }

    get maxScore() {
        let score = localStorage.getItem("maxScore")
        if (score === null) {
            return 0
        }
        return parseInt(score)
    }

    set maxScore(data) {
        localStorage.setItem("maxScore",String(data));
    }

    compareAndSetMaxScore(data) {
        if (this.maxScore && this.maxScore > data) {
            return
        }
        localStorage.setItem("maxScore",String(data));
    }
}


let Store = new __store();
