import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import api from './routes';

const app = express();
const port = process.env.PORT || 3000; //heroku는 port번호가 동적
const devPort = 4000;

//mongodb connection
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb server');
});
//mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb+srv://sang:1234@cluster0-cuyi2.mongodb.net/codelab?retryWrites=true&w=majority');

//express에 미들웨어 먼저 적용
app.use(morgan('dev'));
app.use(bodyParser.json());

//use session
app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));

//express 설정
app.use('/', express.static(path.join(__dirname, './../public')));
app.get('/hello', (req, res) => {
    return res.send('Hello CodeLab');
});
app.use('/api', api);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
})

//handle error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

//development 환경일 때 개발서버 켜기
if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
