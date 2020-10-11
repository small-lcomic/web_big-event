$(function () {
    //1.文章类别列表展示
    initArtCateList();
    //封装函数
    function initArtCateList() {
        $.ajax({
            url:'/my/article/cates',
            type:'get',
            success: function(res){
                var str = template('tpl-art-cate', res);
                $('tbody').html(str);
            }
            
        });
    }
    
    
    //2.显示添加文章分类列表
    var layer = layui.layer;
    var form = layui.form;

    $('#btnAdd').on('click', function () {
        //利用框架代码,显示提示添加文章类别区域

        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-add").html(),
        });
    });

    //3.提交文章分类添加(事件委托)
var indexAdd = null;
$('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    

    $.ajax({
        url:'/my/article/addcates',
        type:'post',
        data:$(this).serialize(),
        success: function(res){
            if (res.status !== 0) {
        return layer.msg(res.message)
            }
            //因为我们添加成功了,所以要重新渲染页面中的数据
            initArtCateList();
            layer.msg('恭喜您,文章类别添加成功!');
            layer.close(indexAdd);
        }
    });
})


//4修改 - 展示菜单
var indexEdit = null;
$('tbody').on('click', '.btn-edit', function () {
    //4.1利用框架代码,显示提示添加文章类别区域
    indexEdit = layer.open({
        type: 1,
        title: '修改文章分类',
        area: ['500px', '250px'],
        content: $('#dialog-edit').html()
    });
    //4.2获取ID 发送ajax获取数据 渲染到页面
    var Id = $(this).attr('data-id');
    console.log(Id);

    $.ajax({
        url:'/my/article/cates/' + Id,
        type:'get',
        success: function(res){
            form.val('form-edit', res.data);
        }
    });
})
    
//5.修改 - 提交菜单
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();

        $.ajax({
            url:'/my/article/updatecate',
            type:'post',
            data:$(this).serialize(),
            success: function(res){
                if (res.status !== 0) {
            return layer.msg(res.message)
                }
            //因为我们添加成功了,所以要重新渲染页面中的数据
            initArtCateList();
            layer.msg('恭喜您,文章类别更新成功!');
            layer.close(indexEdit);
            }
        });
    })

//6.删除
    $('tbody').on('click', '.btn-delete', function () {
        //!!!获取Id,进入到函数中this代指改变了
        var Id = $(this).attr('data-id');
        //显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url:'/my/article/deletecate/'+ Id,
                type:'get',
                success: function(res){
                    if (res.status !== 0) {
                return layer.msg(res.message)
                    }
                    //因为我们更新成功了 要重新渲染页面中的数据
                    initArtCateList();
                    layer.msg("恭喜您,文章类别删除成功!");
                    layer.close(index);
                }
            });
        })
    })

    
})

