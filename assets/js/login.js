//入口函数
$(function () {
    //1.显示隐藏切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    });

    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    //2.自定义规则  
    //从 layui 中获取 form 对象
    var form = layui.form;
    //校验规则
    form.verify({
        //自定义登录表单密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能输入空格'
        ],
        //校验两次密码是否一致的规则--注册表单
        repwd: function (value) {
            //value是输入的值

            //通过形参拿到的是确认密码框中的内容
            //还需拿到密码框中的内容
            //然后进行一次等于的判断
            //如果判断失败,则return一个提示消息

            var pwd = $('.reg-box input[name=password]').val()

            if (pwd !== value) {
                return "两次密码输入不一致"
            }
        }
    });


    //3.注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                //返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                //提交成功后处理代码
                layer.msg("注册成功");
                //手动切换到登录表单
                $('#link_login').click();
                //重置form表单
                $('#form_reg .layui-input').val('')
            }
        });
    })

    //4.登录功能
    $('#form_login').on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',

            data: $(this).serialize(),
            
            success: function (res) {
                //返回状态判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                
                //提示信息,保存token,跳转页面
                layer.msg('恭喜您,登录成功!')
                //保存token,未来的接口要使用token
                localStorage.setItem('token', res.token);
                console.log(res.token);
                //跳转
                location.href = "/index.html";
            }
        });
    })

})