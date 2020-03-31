var http = require('http');

// HTTPRequest의 옵션 설정
var options = {
    host: 'localhost',
    port: '8081',
    path: '/index.html'
};

var callback = function (response) {
    var body = '';

    //response는 EventEmitter 클래스를 상속한 객체

    response.on('data', function (data) {
        body += data;
    });

    response.on('end', function () {
        //데이터 수신 완료
        console.log(body);
    });
}

var req = http.request(options, callback);
req.end();