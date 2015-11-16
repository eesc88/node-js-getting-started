var express=require('express');
var router = express.Router();
var app=express();
//app.use(express.logger('dev'));
////由于Session需要加密session_id，所以一定要传入一个密钥字符串（任意）来加密
//app.use(express.logInByIdAndSessionToken());
////靠这个中间件让我们可以用req.session.key获取对应的value
//app.use(express.);
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

router.get('/login', function (req, res, next) {
    //res.redirect('/login');
    res.render('login');
});

router.get('/register', function (req, res, next) {
    res.render('register');
});


// 查询 Todo 列表
router.get('/', function (req, res, next) {
    var query = new AV.Query(Todo);
    query.descending('createdAt');
    query.find({
        success: function (results) {
            res.render('login', {
                title: 'TODO 列表',
                todos: results
            });
        },
        error: function (err) {
            if (err.code === 101) {
                // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
                // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
                res.render('login', {
                    title: 'TODO 列表',
                    todos: []
                });
            } else {
                next(err);
            }
        }
    });
});

// 新增 Todo 项目
router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username:' + username + "--password:" + password);
    var content = req.body.content;
    var todo = new Todo();
    todo.set('content', content);
    todo.save(null, {
        success: function (todo) {
            //res.redirect('/login');
            next();
        },
        error: function (err) {
            next(err);
        }
    })
})

router.post('/doLogin', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username:' + username + "--password:" + password);
    AV.User.logIn(username, password, {
        success: function (user) {
            //req.session.
            //req.session.user_id = JSON.stringify(user);
            req.session.user_id = user.id; //每一次访问时，session对象的lastPage会自动的保存或更新内存中的session中去。
            req.session.user=JSON.stringify(user);
            res.send('1');
        }, error: function (error) {
            console.log('error:' + JSON.stringify(error));
            res.send(JSON.stringify(error));
        }
    });

})

router.post('/doRegist', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username:' + username + "--password:" + password);
    if (!username || username.trim().length == 0
        || !password || password.trim().length == 0) {
        return res.redirect('/users/register?errMsg=用户名或密码不能为空');
    }
    var user = new AV.User();
    user.set("username", username);
    user.set("password", password);
    user.signUp(null, {
        success: function (user) {
            res.redirect('/index');
        },
        error: function (user, err) {
            //res.redirect('/users/register?errMsg=' + JSON.stringify(err));
            res.send(JSON.stringify(err));
        }
    })
});

module.exports = router;
