var express=require('express');
var router = express.Router();
var app=express();
//app.use(express.logger('dev'));
////����Session��Ҫ����session_id������һ��Ҫ����һ����Կ�ַ��������⣩������
//app.use(express.logInByIdAndSessionToken());
////������м�������ǿ�����req.session.key��ȡ��Ӧ��value
//app.use(express.);
var AV = require('leanengine');

// `AV.Object.extend` ����һ��Ҫ����ȫ�ֱ������������ɶ�ջ�����
// ����� https://leancloud.cn/docs/js_guide.html#����
var Todo = AV.Object.extend('Todo');

router.get('/login', function (req, res, next) {
    //res.redirect('/login');
    res.render('login');
});

router.get('/register', function (req, res, next) {
    res.render('register');
});


// ��ѯ Todo �б�
router.get('/', function (req, res, next) {
    var query = new AV.Query(Todo);
    query.descending('createdAt');
    query.find({
        success: function (results) {
            res.render('login', {
                title: 'TODO �б�',
                todos: results
            });
        },
        error: function (err) {
            if (err.code === 101) {
                // �ô������ϢΪ��{ code: 101, message: 'Class or object doesn\'t exists.' }��˵�� Todo ���ݱ�δ���������Է��ؿյ� Todo �б�
                // ����Ĵ�����������https://leancloud.cn/docs/error_code.html
                res.render('login', {
                    title: 'TODO �б�',
                    todos: []
                });
            } else {
                next(err);
            }
        }
    });
});

// ���� Todo ��Ŀ
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

router.post('/doLogin', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log('username:' + username + "--password:" + password);
    AV.User.logIn(username, password, {
        success: function (user) {
            //req.session.
            //req.session.user_id = JSON.stringify(user);
            req.session.user_id = user.id; //ÿһ�η���ʱ��session�����lastPage���Զ��ı��������ڴ��е�session��ȥ��
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
        return res.redirect('/users/register?errMsg=�û��������벻��Ϊ��');
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
