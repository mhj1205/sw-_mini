const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");
const mongoose = require('../db');
const User = require('../models/User');

app.set('port', 3000);
app.set("views", "views");
app.set("view engine", "ejs");

//// 미들웨어
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

const router = express.Router();

////로그인 페이지
router.route("/login").get((req,res) => {
    res.render("member/LogIn", {}, (err,html)=>{
        res.end(html)
    });
});
////회원가입 페이지
router.route("/joinus").get((req,res) => {
    res.render("member/JoinUs", {}, (err,html)=>{
        res.end(html)
    });
});
////테스트 페이지
router.route("/test").get((req,res) => {
    res.render("test/Test", {}, (err,html)=>{
        res.end(html)
    });
});

////로그인 처리
router.route('/login').post(async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findOne({ id });
        if (!user) {
            console.log('존재하지 않는 계정입니다.');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('로그인 실패! 패스워드가 맞지 않습니다.');
            return res.redirect('/login');
        }

        console.log('로그인 성공!');
        req.session.user = {
            id: user.id,
            name: user.name,
            no: user._id
        };
        res.redirect('/test');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

////회원가입 처리
router.route("/joinus").post(async (req,res) => {
    const { id, password, name, age } = req.body;
    try {
        const newUser = new User({ id, password, name, age });
        await newUser.save();
        console.log('회원가입 성공!');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.use('/', router);
//서버 생성 및 실행
const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`서버 실행 중 ... http://localhost:${app.get('port')}`);
});