/* 功能： @登录 & 注册 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
/* 引入 bcryptjs 对密码进行加密 */
const bcrypt = require('bcryptjs');
/* 引入 安装全球公用头像 gravatar */
const gravatar = require('gravatar');
/* 引入 passprot 验证 token 有效性 */
/* Passport 提供了一个authenticate()函数，用作路由中间件对请求进行身份验证 */
let passport = require('passport');
/* 引入 token jwt */
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
/* 对邮箱进行解析 更换国内公共头像 - Gravatar 在国外  2022-04-04 */
const md5 = require('md5');
function getCravatarURL(email) {
  //  邮箱转小写并去除首尾空格
  const address = String(email).trim().toLowerCase();

  // 获取邮箱的MD5哈希值
  const hash = md5(address);

  // 拼接出最终的头像URL
  return `https://cravatar.cn/avatar/${hash}`;
}

/* 规范返回的数据结构 2022-04-03 */
/**
 * code: Number - 结果码
 * succMsg: String - 成功信息
 * errMsg: String - 错误信息
 * data: Object - 数据
 */

/**
 * @method: 注册
 * @param: {name,email,password}
 * @api: /api/users/register  - POST
 * @return: json
 */
router.post('/register', (req, res) => {
  // 查询数据库是否有相同的邮箱
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      //邮箱已存在
      return res.json({
        code: 400,
        succMsg: '',
        errMsg: '邮箱已被注册！',
        data: {},
      });
    }

    /* 邮箱不存在 */
    /* 创建全球公用头像 gravatar */
    /* const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    }); */
    const avatar = getCravatarURL(req.body.email)
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password,
    });
    /* bcrypt 对密码进行加密 */
    bcrypt.genSalt(10, function (err, salt) {
      /* 将哈希存储在密码数据库中 */
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) err;
        newUser.password = hash;
        newUser
          .save()
          .then(() => {
            res.json({
              code: 200,
              succMsg: '注册成功！',
              errMsg: '',
              data: {},
            });
          })
          .catch(err => err);
      });
    });
  });
});

/**
 * @method: 登录 - 返回 token 与用户信息
 * @param: {name,email,password}
 * @api: /api/users/login  - POST
 * @return: json
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  /* 进行数据库验证登录 */
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.json({
        code: 412,
        succMsg: '',
        errMsg: '用户不存在！',
        data: {},
      });
    }
    /* 用户存在 -> 密码匹配 */
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        /* JWT 赋予一个 token */
        const rule = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        };
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) err;
          res.json({
            code: 200,
            succMsg: '登录成功！',
            errMsg: '',
            data: {
              token: 'Bearer ' + token,
            },
          });
        });
        /* jwt.sign("规则", "加密名字", "过期时间", "箭头函数"); */
      } else {
        return res.json({
          code: 412,
          succMsg: '',
          errMsg: '密码错误！',
          data: {},
        });
      }

    });
  });
});

/**
 * @method: 修改信息密码...
 * @param: { Object } 
 * @return: {  }
*/
/**
 * @method: 登录 - 返回 token 与用户信息
 * @param: {name,email,password}
 * @api: /api/users/login  - POST
 * @return: json
 */
router.post('/modifyInformation', (req, res) => {
  const { _id, oldPass, newPass, content } = req.body;
  /* 进行数据库验证登录 */
  User.findOne({ _id }).then(user => {
    /*  密码匹配 */
    bcrypt.compare(oldPass, user.password).then(isMatch => {
      if (!isMatch) {
        return res.json({
          code: 400,
          succMsg: '',
          errMsg: '密码不匹配！',
          data: {},
        });
      }
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newPass, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save().then(() => {
            res.json({
              code: 200,
              succMsg: '修改成功！',
              errMsg: '',
              data: {},
            });
          })
            .catch(err => err);
        })
      );
    });
  });
});

/* router.get("/current", "验证 token", (req, res) => {
  res.json({ msg: "验证 token" });
}); */

/**
 * @method: 返回用户信息
 * @param: {name,email,password}
 * @api: /api/users/current  - GET
 * @return: json
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
module.exports = router;
