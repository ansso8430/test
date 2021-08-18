const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

const app = express();
dotenv.config();

sequelize.sync({ force : false })
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.set('PORT', process.env.PORT || 3500);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express : app,
    watch : true,
});

app.use(morgan('dev'));

// 없는 페이지 처리 라우터
app.use((req, res, next) => {
    const error = new Error(`${req.url}은 없는 페이지 입니다.`);
    error.status = 404;
    next(error);
});

// 오류 처리 라우터
app.use((err, req, res, next) => {
    const data = {
        message : err.message,
        status : err.status || 500,
        stack : err.stack,
    };
    return res.status(data.status).render('error', data);
});

app.listen(app.get('PORT'), () => {
    console.log(app.get('PORT'), '번 포트에서 서버 대기중...');
});