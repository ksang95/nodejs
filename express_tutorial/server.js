var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

app.set('views', __dirname + '/views'); //서버가 읽을 수 있도록 HTML 의 위치를 정의
app.set('view engine', 'ejs'); //서버가 HTML 렌더링을 할 때, EJS 엔진을 사용하도록 설정
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function () {
    console.log("Express server has started on port 3000");
});
app.use(express.static('public')); //public 폴더 내의 정적 파일 다루기

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));

//bodyParser 설정 아래에 있어야.
var router = require('./router/main')(app,fs); //라우터 모듈인 main.js 를 불러와서 app 에 전달