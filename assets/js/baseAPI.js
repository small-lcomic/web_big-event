
//发出ajax之前会触动 ajaxPrefilter 方法
//可以通过options 配置 ajax 各种参数
$.ajaxPrefilter(function (options) {
    // alert(options.url)
    //拼接对应环境的服务器地址
    options.url = "http://ajax.frontend.itheima.net" + options.url;

    //对需要权限的接口配置信息
    //必须以my开头才行
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    //3.拦截所有响应,判断身份认证信息
    options.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            //1.清空本地token
            localStorage.removeItem;('token')
            //2.页面跳转
            location.href = '/login.html';
        }
    }
})