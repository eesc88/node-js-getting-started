var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */

AV.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});
AV.Cloud.define('Login', function (request, response) {
    response.success('Hello world!--Login');
});

AV.Cloud.define('Regist', function (request, response) {
    response.success('Hello world!-->Regist');
});

AV.Cloud.afterSave('Todo', function (request) {
    //输出信息请到「应用控制台 > 存储 > 云引擎 > 日志」中查看
    console.log(request.object);
    request.object.set('from', 'LeanCloud');
    request.object.save(null, {
        success: function (user) {
            console.log('ok!');
        }, error: function (user, error) {
            console.log('error', error);
        }
    });
});

AV.Cloud.beforeUpdate('Todo', function (request, response) {
    // 如果 comment 字段被修改了，检查该字段的长度
    if (request.object.updatedKeys.indexOf('comment') != -1) {
        if (request.object.get('comment').length <= 140) {
            response.success();
        } else {
            // 拒绝过长的修改
            response.error('commit 长度不得超过 140 字符');
        }
    } else {
        response.success();
    }
});

AV.Cloud.beforeUpdate('_User', function (request, response) {
    // 如果 comment 字段被修改了，检查该字段的长度
    if (request.object.updatedKeys.indexOf('comment') != -1) {
        if (request.object.get('comment').length <= 140) {
            response.success();
        } else {
            // 拒绝过长的修改
            response.error('commit 长度不得超过 140 字符');
        }
    } else {
        response.success();
    }
});

module.exports = AV.Cloud;
