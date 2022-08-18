-- tl_ops_plugin_tracing
-- en : tracing  
-- zn : 请求追踪插件
-- @author iamtsm
-- @email 1905333456@qq.com

local tlog = require("utils.tl_ops_utils_log"):new("tl_ops_plugin_tracing");
local tl_ops_utils_func = require("utils.tl_ops_utils_func");

local _M = {
    _VERSION = '0.01'
}

local mt = { __index = _M }


function _M:new(options)
    if not options then
        options = {}
    end
    return setmetatable(options, mt)
end


function _M:tl_ops_process_before_init_access(ctx)
    

    return true, "ok"
end

function _M:tl_ops_process_after_init_access(ctx)
    

    return true, "ok"
end

function _M:tl_ops_process_before_init_header(ctx)
   

    return true, "ok"
end

function _M:tl_ops_process_after_init_header(ctx)
   

    return true, "ok"
end

function _M:tl_ops_process_before_init_log(ctx)
    

    return true, "ok"
end

function _M:tl_ops_process_after_init_log(ctx)
    

    return true, "ok"
end


return _M
