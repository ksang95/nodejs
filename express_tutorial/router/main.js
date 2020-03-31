module.exports = function (app, fs) {
    //module.exports 는 server.js 에서 router를 모듈로서 불러올 수 있도록 사용

    // app.get('/', function (req, res) {
    //     res.render('index.html'); //주소에 맞는 html파일 연결
    // });
    // app.get('/about', function (req, res) {
    //     res.render('about.html');
    // });

    app.get('/', function (req, res) {
        var sess = req.session;
        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5,
            name: sess.name,
            username: sess.username
        }); //두번째 인자로 JSON을 전달하여 페이지에서 해당 데이터를 사용 가능
    });

    app.get('/list', function (req, res) {
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
            console.log(data);
            res.end(data);
        });
    });

    app.get('/getUser/:username', function (req, res) {
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]); //해당하는 유저 객체 value 출력
        });
    });

    app.post('/addUser/:username', function (req, res) {
        var result = {};
        var username = req.params.username;

        //CHECK REQ VALIDITY
        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        //LOAD DATA & CHECK DUPLICATION
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            if (users[username]) {
                //DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            //ADD TO DATA
            users[username] = req.body;

            //SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function (err, data) { //JSON을 string으로 만들 때 탭으로 정리
                result = { "success": 1 };
                res.json(result);
            })
        });
    });

    app.put('/updateUser/:username', function (req, res) {
        var result = {};
        var username = req.params.username;

        //CHECK REQ VALIDITY
        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        //LOAD DATA & CHECK DUPLICATION
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            if (!users[username]) {
                //NONE FOUND
                result["success"] = 0;
                result["error"] = "none";
                res.json(result);
                return;
            }

            //ADD TO DATA
            users[username] = req.body;

            //SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function (err, data) { //JSON을 string으로 만들 때 탭으로 정리
                result = { "success": 1 };
                res.json(result);
            })
        });
    });

    app.delete('/deleteUser/:username', function (req, res) {
        var result = {};
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);

            //IF NOT FOUND
            if (!users[req.params.username]) {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username]; //객체의 속성 제거하는 연산자
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function (err, data) {
                result["success"] = 1;
                res.json(result);
                return;
            });
        });
    });

    app.get('/login/:username/:password', function (req, res) {
        var sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf-8", function (err, data) {
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if (!users[username]) {
                //USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if (users[username]["password"] === password) {
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            } else {
                result["success"] = 0;
                result["error"] = "incorrect password";
                res.json(result);
            }
        });
    });

    app.get('/logout', function (req, res) {
        sess = req.session;
        if (sess.username) {
            req.session.destroy(function (err) { //세션 제거
                //cannot access session here
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });

}