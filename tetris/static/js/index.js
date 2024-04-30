// 用户div赋值
function fillUserinfo(nickname) {
    $('#user-avatar').attr('src', 'https://api.multiavatar.com/' + nickname + '.png');
    $('#user-nickname').text(nickname);
}

// 显示登入或用户信息栏
function showLoginForm(isLogout) {
    if (isLogout) {
        $("#login-form").show();
        $("#userinfo").hide();
    } else {
        $("#login-form").hide();
        $("#userinfo").show();
    }
}

// 绑定登入按钮
function bindLogin() {
    $("#login-form").on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        let check = this.checkValidity()
        this.classList.add("was-validated")
        if (!check) {
            return
        }
        let username = $("#input-username").val();
        let password = $("#input-password").val();

        http.userApi.login({"name": username, "password": password}).then((resp)=>{
            let data = resp.data
            isLogin = true
            // TODO token info
            Store.tokenInfo = {"token": data.token, "nickname": data.name};
            getAndSaveUserinfo();
            showLoginForm(false);
        }).catch(data=>{
            console.log(data);
            alert("登入失败");
        })
    });
}

// 绑定登出按钮
function  bindLogout() {
    $("#logout-button").on("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        showLoginForm(true);
        Store.cleanTokenInfo();
    })
}

// 绑定事件合集
function bindALL() {
    bindLogin();
    bindLogout();
}

// 获取并保存用户信息
function getAndSaveUserinfo() {
    http.userApi.getUserinfo().then(resp=>{
        let data = resp.data
        // 更新历史数据
        Store.maxScore = Number(data.highestScore); //
        fillUserinfo(data.name); // 填充div内容
    })
}

// 登入状态相关
function loginSetting() {
    let tInfo = Store.tokenInfo;
    if (tInfo === null) {
        showLoginForm(true);
        return  false
    }
    getAndSaveUserinfo();
    showLoginForm(false);
    return true
}

// 获取并渲染排行榜数据
function getAndFillRank() {
    http.userApi.getRank().then((resp)=>{
        let data = resp.data
        $('#history-tbody').empty();
        $.each(data, (index,item)=>{
            let src = `https://api.multiavatar.com/${item.users_model.name}.png`
            $('#history-tbody').append(`<tr>
                     <th scope="row">${index+1}</th>
                     <td><img class="avatar-min" src="${src}" alt=""/></td>
                     <td>${item.users_model.name}</td>
                     <td>${item.score}</td>
                </tr>`)
        })
    })
}


let isLogin = false
window.onload = function () {
    // 绑定事件
    bindALL();

    // 处理登入状态
    isLogin = loginSetting();

    getAndFillRank();

    new Tetris("tetris", (score)=>{
        Store.compareAndSetMaxScore(score);
        if (isLogin) {
            http.userApi.uploadScore({score: score}).then(data=>{
                console.log("upload score success: ",data);
                getAndFillRank();
            }).catch(data=>{
                console.log("upload score fail: ",data);
            })
        }else{
            console.log("not login");
        }
    });
}
