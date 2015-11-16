var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

AV.Cloud.define('Todo', function(request, response) {
  response.success('Todo world!');
});

module.exports = AV.Cloud;
