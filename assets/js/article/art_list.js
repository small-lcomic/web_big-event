$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)
        
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh =padZero(dt.getHours())
        var mm =padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        
        return y + '-' + m + '-' + d + ' ' +  hh + ':' + mm + ':' + ss
    }
    
    //在个位数填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // ---------------------------
    //1.定义提交参数
    var q = {
        pagenum: 1,//页码值,默认请求第一页得数据
        pagesize: 2,//每页显示几条数据,默认显示2条
        cate_id: "",//文章分类得Id
        state: "",//文章的发布状态
    };

    //2.初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            url:'/my/article/list',
            type:'get',
            data:q,
            success: function(res){
            //     if (res.status !== 0) {
            // return layer.msg('')
            //     }
                var str = template('tpl-table', res);
                $('tbody').html(str);
                //分页
                renderPage(res.total)
            }
        });
    }

    //3.初始化分类
    var form = layui.form;
    initCate();

    function initCate() {
        $.ajax({
            url:'/my/article/cates',
            type:'get',
            success: function(res){
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

    //4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        //获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })


    //5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意,这里的test1是 ID.
            count: total,//数据总数,从服务器端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页

            //分页模块设置,显示哪些子模块
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            limits:[2,3,5,10],

            
            //触发jump:分页初始化的时候,页码改变的时候
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数

                //改变当前页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                //首次不执行,判断,不是第一次初始化分页,才能重新覅用初始化文章列表
                if(!first){
                  //初始化文章列表
                    initTable();
                }
              }
        })

    }

    //6.删除
    var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        //先获取Id  进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        //显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + Id,
                type: 'get',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    
                    layer.msg('恭喜您,文章删除成功!');
                    //页面汇总删除按钮个数等于1,页码大于1
                    if ($('btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    //if ($('tbody tr').length == 1 && q.pagenum > 1) q.pagenum--;

                    //更新成功 渲染
                    initTable();
                    
                }
            });
            layer.close(index);
        });
    })
         
    /* //编辑绑定点击事件
    var layer = layui.layer;
    $('tbody').on('click', '.btn-text', function () {
        
    }) */
})