'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
    //CHECK USERNAME FORMAT
    //username은 소문자 또는 숫자 하나 이상으로 이뤄진다
    var usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) {
        //해당 정규식 패턴에 적합한지 판정
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    //CHECK PASS LENGTH
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    //CHECK USER EXISTANCE
    _account2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            //exist에는 Document 들어가있음
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        //CREATE ACCOUNT
        var account = new _account2.default({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        //SAVE IN THE DATABASE
        account.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

router.post('/signin', function (req, res) {
    if (typeof req.body.password != 'string') {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    _account2.default.findOne({ username: req.body.username }, function (err, account) {
        if (err) throw err;

        //CHECK ACCOUNt EXISTANCY
        if (!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        //CHECK WHETHER THE PASSWORD IS VALID
        if (!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        //ALTER SESSION
        var session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        //RETURN SUCCESS
        return res.json({
            success: true
        });
    });
});

router.get('/getinfo', function (req, res) {
    if (!req.session) return res.status(401).json({
        error: 1
    });
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    return res.json({ info: req.session.loginInfo });
});

router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) throw err;
    });
    return res.json({ success: true });
});

router.get('/search/:username', function (req, res) {
    //SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    _account2.default.find({ username: { $regex: re } }, { _id: false, username: true }).limit(5).sort({ username: 1 }).exec(function (err, accounts) {
        if (err) throw err;
        return res.json(accounts);
    });
});

router.get('/search', function (req, res) {
    return res.json([]);
});

exports.default = router;