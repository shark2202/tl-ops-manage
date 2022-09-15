const _table_id_name = "tl-ops-web-auth-user-table";
const _search_id_name = "tl-ops-web-auth-user-search";
const _add_form_btn_id_name = "tl-ops-web-auth-user-form-submit";
const _add_form_id_name = "tl-ops-web-auth-user-form";
let res_data = {};

const tl_ops_web_auth_user_main = function (){
    window.$ = layui.$;
    window.form = layui.form;
    window.table = layui.table;
    window.layedit = layui.layedit;

    tl_ops_web_auth_user_render();

    //事件操作
    $('.layui-btn.layuiadmin-btn-useradmin').on('click', function(){
        let type = $(this).data('type');
        tl_ops_web_auth_user_event()[type] ? tl_ops_web_auth_user_event()[type].call(this) : '';
    });

    //搜索
    form.on('submit('+_search_id_name+')', function(data){
        tl_ops_web_auth_user_reload(data.field);
    });

    //行事件操作
    table.on('tool('+_table_id_name+')', function(obj) {
        let type = obj.event;
        let data = obj.data;
        tl_ops_web_auth_user_event()[type] ? tl_ops_web_auth_user_event()[type].call(this, data) : '';
    });

};

//事件监听定义
const tl_ops_web_auth_user_event = function () {
    return {
        add:  tl_ops_web_auth_user_add,
        edit : tl_ops_web_auth_user_edit,
        delete : tl_ops_web_auth_user_delete,
        config : tl_ops_web_auth_config
    }
};

//表格cols
const tl_ops_web_auth_user_cols = function () {
    return [[
        {
            type:'checkbox',fixed : 'left', width: "10%"
        }, {
            field: 'id', title: 'ID',width:"15%"
        }, {
            field: 'username', title: '用户名',width:"25%"
        }, {
            field: 'password', title: '密码', width:"20%"
        }, {
            field: 'updatetime', title: '更新时间',width:"15%",
        }, {
            width: "15%",
            align: 'center',
            fixed: 'right',
            title: '操作',
            toolbar: '#tl-ops-web-auth-user-operate'
        }
    ]];
};



//用户列表
const tl_ops_web_auth_config = function(){
    let index = layer.open({
        type: 2
        ,title: '管理登录配置'
        ,content: 'tl_ops_web_auth.html'
        ,maxmin: true
        ,minStack:false
        ,area: ['700px', '750px']
        ,end : function () {
            tl_ops_web_auth_user_render()
        }
    });
    layer.full(index);
}


//表格render
const tl_ops_web_auth_user_render = function () {
    table.render(tl_ajax_data({
        elem: '#'+_table_id_name,
        url: '/tlops/auth/get',
        cols: tl_ops_web_auth_user_cols(),
        page:true,
        needReloadMsg : false,
        toolbar: '#tl-ops-web-auth-user-toolbar',
        defaultToolbar: ['filter', 'print', 'exports'],
        totalRow: true, //开启合计行
        parseData: function(res){
            if (res.code !== 0){
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": 0,
                    "data": []
                };
            }
            res_data = res.data;
            let datas = res_data.tl_ops_plugin_auth_list;
            if (datas === undefined){ datas = []; }
            datas = datas.sort(function(a, b){return b.id - a.id})
            return {
                "code": res.code,
                "msg": res.msg,
                "count": datas.length,
                "data": datas
            };
        }
    }));
};

//表格reload
const tl_ops_web_auth_user_reload = function (matcher) {
    table.render(tl_ajax_data({
        elem: '#'+_table_id_name,
        url: '/tlops/auth/get',
        where : matcher,
        cols: tl_ops_web_auth_user_cols(),
        page:true,
        needReloadMsg : false,
        toolbar: '#tl-ops-web-auth-user-toolbar',
        defaultToolbar: ['filter', 'print', 'exports'],
        totalRow: true, //开启合计行
        parseData: function(res){
            if (res.code !== 0){
                return {
                    "code": res.code,
                    "msg": res.msg,
                    "count": 0,
                    "data": []
                };
            }
            res_data = res.data;
            let datas = res_data.tl_ops_plugin_auth_list;
            if (datas === undefined){ datas = []; }
            datas = datas.sort(function(a, b){return b.id - a.id})
            return {
                "code": res.code,
                "msg": res.msg,
                "count": datas.length,
                "data": datas
            };
        }
    }));
};


//删除ssl
const tl_ops_web_auth_user_delete = function () {
    let checkStatus = table.checkStatus(_table_id_name)
        ,checkData = checkStatus.data; //得到选中的数据

    if(checkData.length === 0){
       layer.msg('请选删除择数据');
       return;
    }

    let idList = [];
    for(let i = 0; i < checkData.length; i++){
        idList.push(checkData[i].id);
    }

    let new_list = res_data.tl_ops_plugin_auth_list.filter(item=>{
        return !idList.includes(item.id);
    })

    $.ajax(tl_ajax_data({
        url: '/tlops/auth/set',
        data : JSON.stringify({
            tl_ops_plugin_auth_list : new_list
        }),
        contentType : "application/json",
        success : (res)=>{
            tl_ops_web_auth_user_reload()
        }
    }));
}


//添加
const tl_ops_web_auth_user_add = function () {
    let index = layer.open({
        type: 2
        ,title: '添加用户'
        ,content: 'tl_ops_web_auth_user_form.html'
        ,maxmin: true
        ,minStack:false
        ,area: ['700px', '600px']
        ,btn: ['确定', '取消']
        ,yes: function(sub_index, layero){
            let iframeWindow = window['layui-layer-iframe'+ sub_index]
                ,submit = layero.find('iframe').contents().find('#'+ _add_form_btn_id_name);

            iframeWindow.layui.form.on('submit('+ _add_form_btn_id_name +')', function(data){
                if(!tl_ops_auth_user_data_add_filter(data)){
                    return;
                }
                $.ajax(tl_ajax_data({
                    url: '/tlops/auth/set',
                    data : JSON.stringify({
                        tl_ops_plugin_auth_list : res_data.tl_ops_plugin_auth_list
                    }),
                    contentType : "application/json",
                    success : (res)=>{
                        tl_ops_web_auth_user_reload()
                    }
                }));
                layer.close(sub_index);
            });
            submit.trigger('click');
        }
    });
    layer.full(index)
};


//编辑
const tl_ops_web_auth_user_edit = function (evtdata) {
    let index = layer.open({
        type: 2
        ,title: '编辑用户'
        ,content: 'tl_ops_web_auth_user_form.html'
        ,maxmin: true
        ,minStack:false
        ,area: ['700px', '600px']
        ,btn: ['确定', '取消']
        ,yes: function(sub_index, dom){
            let iframeWindow = window['layui-layer-iframe'+ sub_index]
                ,submit = dom.find('iframe').contents().find('#'+ _add_form_btn_id_name);
            iframeWindow.layui.form.on('submit('+ _add_form_btn_id_name +')', function(data){
                if(!tl_ops_auth_user_data_edit_filter(data)){
                    return;
                }
                $.ajax(tl_ajax_data({
                    url: '/tlops/auth/set',
                    data : JSON.stringify({
                        tl_ops_plugin_auth_list : res_data.tl_ops_plugin_auth_list
                    }),
                    contentType : "application/json",
                    success : (res)=>{
                        tl_ops_web_auth_user_reload()
                    }
                }));
                layer.close(sub_index);
            });
            submit.trigger('click');
        },
        success: function(dom, index) {
            let editForm = dom.find('iframe')[0].contentWindow;
            editForm.tl_ops_web_auth_user_form_render(evtdata);
        },
    });
    layer.full(index)
};


//过滤新增数据
const tl_ops_auth_user_data_add_filter = function( data ) {
    delete data.field.file;
    for(let key in data.field){
        if(key === 'id'){
            continue;
        }
        if(data.field[key] === undefined || data.field[key] === null || data.field[key] === ''){
            layer.msg(key + "未填写")
            return false;
        }
    }
    res_data.tl_ops_plugin_auth_list.push(data.field)

    res_data.tl_ops_plugin_auth_list.forEach(item=>{
        if( item.LAY_TABLE_INDEX !== undefined){
            delete item.LAY_TABLE_INDEX
        }
        if( item.LAY_CHECKED !== undefined){
            delete item.LAY_CHECKED
        }
    })

    return true
}


//过滤编辑数据
const tl_ops_auth_user_data_edit_filter = function( data ) {
    delete data.field.file;
    for(let key in data.field){
        if(data.field[key] === undefined || data.field[key] === null || data.field[key] === ''){
            layer.msg(key + "未填写")
            return false;
        }
    }
    let cur_list = []
    res_data.tl_ops_plugin_auth_list.forEach((item)=>{
        if(parseInt(item.id) === parseInt(data.field.id)){
            data.field.change = true;
            item = data.field;
        }
        cur_list.push(item)
    })
    res_data.tl_ops_plugin_auth_list = cur_list;

    res_data.tl_ops_plugin_auth_list.forEach(item=>{
        if( item.LAY_TABLE_INDEX !== undefined){
            delete item.LAY_TABLE_INDEX
        }
        if( item.LAY_CHECKED !== undefined){
            delete item.LAY_CHECKED
        }
    })

    return true
}