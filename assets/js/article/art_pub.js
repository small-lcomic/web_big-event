$(function () {
    var form = layui.form;
    var layer = layui.layer;

    // 初始化富文本


    // 1.0 初始化图片裁剪器
    var $image = $('#image')

    // 1.1 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 1.2 初始化裁剪区域
    $image.cropper(options)


    initEditor()


    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //赋值 渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        });
    }

    //2.初始化富文本编辑器
    initEditor()


    //4.头像
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

      // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //5.设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = "草稿";
    })

    //6.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        
        //创建FormData对象 收集数据
        var fd = new FormData(this);
        //放入状态
        fd.append('state', state);
        //放入图片
        $image.cropper('getCroppedCanvas', {//创建一个canvas画布
            
            width: 400,
            height: 250
        })
            //将 Canvas 画布上的内容,转化为文件对象
            .toBlob(function (blob) {
                //得到文件对象后,进行后续的操作
                fd.append('cover_img', blob);
                //发送 ajax 要在toBlob()函数里面
                // console.log(...fd);
                publishArticle(fd);
                
            })
    });

    function publishArticle(fd) {
        $.ajax({
            url:'/my/article/add',
            type: 'post',
            contentType: false,
            processData:false,
            data:fd,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.layui.msg(res.message);
                }
                //跳转页面
                // location.href = '/article/art_list.html';
                //去除bug
                layer.msg('恭喜您,添加文章成功,跳转中...')
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                },2000)

            }
        });
    }

    
})