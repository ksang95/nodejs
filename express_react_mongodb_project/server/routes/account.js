import express from 'express';
import Account from '../models/account';

const router = express.Router();

router.post('/signup', (req, res) => {
    //CHECK USERNAME FORMAT
    //username은 소문자 또는 숫자 하나 이상으로 이뤄진다
    let usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) { //해당 정규식 패턴에 적합한지 판정
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
    Account.findOne({ username: req.body.username }, (err, exists) => {
        if (err) throw err;
        if (exists) { //exist에는 Document 들어가있음
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        //CREATE ACCOUNT
        let account = new Account({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        //SAVE IN THE DATABASE
        account.save(err => {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

router.post('/signin', (req, res) => {
    if (typeof req.body.password != 'string') {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    Account.findOne({ username: req.body.username }, (err, account) => {
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
        let session = req.session;
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

router.get('/getinfo', (req, res) => {
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

router.post('/logout', (req, res) => {
    req.session.destroy(err => { if (err) throw err; });
    return res.json({ success: true });
});

router.get('/search/:username', (req, res) => {
    //SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    var re = new RegExp('^' + req.params.username);
    Account.find({ username: { $regex: re } }, { _id: false, username: true })
        .limit(5)
        .sort({ username: 1 })
        .exec((err, accounts) => {
            if (err) throw err;
            return res.json(accounts);
        });
});

router.get('/search', (req, res) => {
    return res.json([]);
});

export default router;