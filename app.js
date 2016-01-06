'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
//var session = require('session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var user = require('./routes/user');
var index = require('./routes/index');
var weixin=require('./routes/weixin');
var cloud = require('./cloud');

var app = express();

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 加载云代码方法
app.use(cloud);



app.get('/', function (req, res) {
    res.render('index', {currentTime: new Date()});
});

// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);

app.use('/user', user);
app.use('/weixin', weixin);
app.use('/index', index);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) { // jshint ignore:line
        var statusCode = err.status || 500;
        if (statusCode === 500) {
            console.error(err.stack || err);
        }
        res.status(statusCode);
        res.render('error', {
            message: err.message || err,
            error: err
        });
    });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function (err, req, res, next) { // jshint ignore:line
    res.render('error', {
        message: err.message || err,
        error: {}
    });
});

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function (err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    res.render('error', {
        message: err.message || err,
        error: {}
    });
});

module.exports = app;
