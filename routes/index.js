/**
 * Created by administratorUI02 on 2015/11/12.
 */
var router = require('express').Router();
var AV = require('leanengine');

router.get('/', function (req,res,next) {
    console.log("==================");
    var userId=req.session.user_id
    console.log("==================user:"+userId);
    //if(user){
    //    res.render('user/login');
    //}else{
    //    res.render('index');
    //}
    res.render('index');

});

router.post('/', function (req,res,next) {
    res.render('index');
});

module.exports = router;