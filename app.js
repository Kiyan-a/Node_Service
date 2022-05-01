let express = require('express');
let app = express();
let port = 3500;
/* 日志插件 */
let morgan = require('morgan');
const mongoose = require('mongoose');
/* 修改控制台输出颜色  2022-04-30 */
const chalk = require("chalk");
const log = console.log;
/*  app.use('/public/', express.static('./public/'))  */

/* 引入 routes API.js 文件 */
const users = require('./routes/api/users');
const collection = require('./routes/api/collection');
const article = require('./routes/api/article');

/* 引入 passport 模块,身份验证中间件 */
let passport = require('passport');

/* 引入 body-parser 模块 */
let bodyParser = require('body-parser');
// 在处理程序之前在中间件中解析传入的请求主体，req.body属性下可用

/* 新增日志查看 - 2022-04-03 */
morgan.format('joke', ':method :url :status :response-time/ms');
app.use(morgan('joke'));

/* 使用 body-parser 中间件 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* 引入 mongoose 配置文件模块 config keys 对象*/
const db = require('./config/keys').mongoUrI;

/* 连接数据库 - 同样提供了*Promise API*/
mongoose
  .connect(db)
  .then(() => {
    log(chalk.green.bold('🧩 MongoDB 数据库连接成功！'));
  })
  .catch(err => {
    log(chalk.red.bold.italic('❌ MongoDB 数据库连接失败！'));
  });

/* passporrt 初始化 配置全局的 token 身份认证器 */
app.use(passport.initialize());
require('./config/passport')(passport);

/* 使用引入进来的 API.js 文件*/
app.use('/api/users', users);
app.use('/api/collection', collection);
app.use('/api/article', article);

app.get('*', (req, res) => {
  res.json({
    code: 404,
    succMsg: '',
    errMsg: 'No Found',
    data: {},
  });
});

app.listen(port, () => {
  log(chalk.green.bold(`👌 服务器启动成功 http://localhost:${port}`));
});
