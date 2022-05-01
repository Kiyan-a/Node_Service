# Node_Service

文档说明：[API 接口文档](https://www.apifox.cn/apidoc/shared-acbc1b4d-8a01-4d00-afce-90dcf71e8dc9/api-18010748)



使用：

拉取项目

```shell
git clone https://github.com/Kiyan-a/Node_Service.git
```

安装依赖

```shell
npx yarn
```

运行项目:

```shell
npm run dev
```

--------------------------------------------以下为开发记录📝------------------------------------------------------------

#### 初始化一个项目

```
npm init
```

#### 全局安装自动更新 node 模块 “nodemon”

```
npm install -g nodemon
```

##### 更改 npm 命令

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "nodemon app.js",
    "start": "node app.js"
  }
```

### 安装和使用 express 模块

```
npm i express
```

```
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000)
```

### 开放 public 资源 导入 path 模块,才能访问 public 目录下的文件

```
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
```

### 连接数据库 安装 mongoose

```
npm i mongoose
```

```
mongoose
  .connect('xxx.xxx.com')
  .then(() => {
    console.log("MongoDB 连接成功");
  })
  .catch((err) => {
    console.log("MongoDB 连接失败");
  });
```

### 安装 passport 模块 对身份进行验证

```
npm i passport
```

### 安装 bcrypt 模块 对密码进行加密

```
npm i bcrypt
```

###### 如果 bcrypt 安装失败可以使用 bcryptjs 代替

```
npm i bcryptjs
```

#### 对密码进行加密

```
//bcrypt 对密码进行加密
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => {
              console.log(err);
            });
        });
      });
```

### 对登录 密码匹配

```
// 密码匹配
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //JWT赋予一个token
        const rule = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          identity: user.identity,
        };
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ success: true, token: "Bearer " + token });
        });
        /* jwt.sign("规则", "加密名字", "过期时间", "箭头函数"); */
        /* res.json({ msg: "密码匹配" }); */
      } else {
        return res.status(400).json("密码错误!");
      }
    });
```

### 安装全球公用头像 gravatar

```

npm i gravatar

```

### 安装 jwt 模块 （token 令牌或者钥匙）

```

npm i jsonwebtoken

```

###### 进行数据库验证登录　//JWT 赋予一个 token

```

User.findOne({ email }).then((user) => {
if (!user) {
return res.status(404).json({ email: "用户不存在!" });
}
// 密码匹配
bcrypt.compare(password, user.password).then((isMatch) => {
if (isMatch) {
//JWT 赋予一个 token
const rule = { id: user.id, name: user.name };
jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
if (err) throw err;
res.json({ success: true, token: "mrwu" + token });
});
/_ jwt.sign("规则", "加密名字", "过期时间", "箭头函数"); _/
/_ res.json({ msg: "密码匹配" }); _/
} else {
return res.status(400).json({ password: "密码错误!" });
}
});
});

```

### 安装 passprot 和 passprot-jwt 验证 token

```

npm i passport-jwt
npm i passport

```

### 创建 vue 启动项目

```

vue create project
npm run serve

```

###### 因为需要同时启动两个服务器 node-->app.js 和 vue ，安装 concurrently 模块连载两个项目，这样就不需要同时启动两个项目

```

npm install concurrently

```

###### 配置 concurrently

```

在 vue 项目 package.json 文件中
"scripts": {
//
"start":"npm run serve"
}

```

```

在 根 项目 package.json 文件中
"scripts": {
//
"client-install":"npm install --prefix client"
"client":"npm start --prefix client",
//和并两个项目启动
"dev":"concurrently \"npm run server\" \"npm run client\""
}

```

### 安装 element ui

```

npm i element-ui -S

```

## 解决 vue@cli 4.0 跨域请求问题

###### 在 vue 项目根目录下新建一个名称叫 vue.config.js 的配置跨域文件，把下面内容粘贴进去

```

module.exports = {
devServer: {
host: 'localhost',
port: '8081', // 端口号
https: false, // https: {type:Bollean}
open: true, // 配置自动启动浏览器
// 配置代理
proxy: {
"/api": {
target: 'http://www.baidu.com', // 想要访问接口域名
changeOrigin: true, // 开启跨域,在本地创建一个虚拟服务,然后发送请求的数据,并同时接收请求的数据,这样服务端和服务端进行数据交互就不会有问题
pathRewrite: {
"^/api": '', // 利用这个地面的值拼接上 target 里面的地址
}
}
}
}
}

```

### 点击登录按钮 ---拿到 token 并储存在 LocalStorage 中

```

submitForm(formName) {
this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('api/users/login', this.loginUser).then((res) => {
// console.log(res);
this.$message({
              message: '登录成功!',
              type: 'success',
              center: true,
            });
            /* 拿到token */
            // 使用ES6语法解构
            const { token } = res.data;
            // 将token储存在localstorage中
            localStorage.setItem('eleToken', token);
          });
          this.$router.push('/index');
}
});
},

```

### 点击注册按钮

```

submitForm(formName) {
this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
.post('api/users/register', this.registerUser)
.then((res) => {
console.log('registration success!' + res);
this.$message({
                message: '注册成功!',
                type: 'success',
                center: true,
              });
            });
          this.$router.push('/login');
} else {
console.log('error submit!!');
return false;
}
});
},

```

### 路由守卫 让没有登录或者注册的时候 不允许用户打开其他页面

```

```

#### 安装一个能解析 token 的模块

```

npm install jwt-decode

```

### 解析 token 储存在 Vuex 中

```

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const types = {
SET_AUTHENTICATED: "SET_AUTHENTICATED",
SET_USER: "SET_USER",
};
const state = {
isAuthenticated: false,
user: {},
};
const getters = {
isAuthenticated: (state) => {
state.isAuthenticated;
},
user: (state) => state.user,
};
const mutations = {
[types.SET_AUTHENTICATED](state, isAuthenticated) {
if (isAuthenticated) state.isAuthenticated = isAuthenticated;
else state.isAuthenticated = false;
},
[types.SET_USER](state, user) {
if (user) state.user = user;
else state.user = {};
},
};
const actions = {
setAuthenticated: ({ commit }, isAuthenticated) => {
commit(types.SET_AUTHENTICATED, isAuthenticated);
},
setUser: ({ commit }, user) => {
commit(types.SET_USER, user);
},
};

export default new Vuex.Store({
state,
getters,
mutations,
actions,
// types,
});

```

### 解决刷新之后 Vuex 保存的数据被刷新清空， 将组件中调用 Vuex 的方法属性模块放到根组件下 app.vue

```

<script>
/* 引入解析 token 的模块 */
import jwt_decode from 'jwt-decode';
export default {
  name: 'app',
  components: {},
  created() {
    if (localStorage.eleToken) {
      const decode = jwt_decode(localStorage.eleToken);
      this.$store.dispatch('setAuthenticated', !this.isEmpty(decode));
      this.$store.dispatch('setUser', decode);
    }
  },
  methods: {
    // 判断数据 value 是否为空，返回 turn false
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim(value).length === 0)
      );
    },
  },
};
</script>

```

## 路由守卫 和 token 过期处理

```

// 路由守卫;
router.beforeEach((to, from, next) => {
const isLogin = localStorage.eleToken ? true : false;
if (to.path == "/login" || to.path == "/register") {
next();
} else {
isLogin ? next() : next("/login");
}
});

```

## 在请求拦截和响应拦截中处理 token 过期

###### 配置请求拦截和响应拦截 在登录成功之后将 token 设置为请求头，在响应拦截时候判断当前 token 是否过期的--->如果过期的话就把它删除 反之所有接口就可以正常使用

```

/_ @请求拦截 和 @响应拦截 _/
import axios from "axios";
// 引入 Element UI 加载动画,警告消息
import { Message, Loading } from "element-ui";
import router from "./router";
// 在需要调用时：
let loading;
// 开始一个加载动画
function startLoading() {
loading = Loading.service({
lock: true,
text: "正在加载中...",
background: "rgba(0,0,0,0.7)",
});
}
// 结束一个加载动画
function endLoading() {
loading.close();
}

/_ 配置请求拦截和响应拦截
在登录成功之后将 token 设置为请求头，
在响应拦截时候判断当前 token 是否过期的--->如果过期的话就把它删除 反之所有接口就可以正常使用
_/
// 请求拦截
axios.interceptors.request.use(
(config) => {
// 调用加载动画
startLoading();

    // 在登录成功之后的判断 token 是否存在
    if (localStorage.eleToken) {
      // 将 token 设置为请求头
      config.headers.Authorization = localStorage.eleToken;
    }
    return config;

},
(err) => {
return Promise.reject(err);
}
);

// 响应拦截
axios.interceptors.response.use(
(res) => {
// 结束加载动画;
endLoading();
return res;
},
(rej) => {
endLoading();
// 错误提醒
Message.error(rej.response.data);
// 获取错误状态码 401,401 代表当前 token 已经失效了
const { status } = rej.response;
if (status == 401) {
Message.error("token 失效!,请重新登录");
// 清除 token
localStorage.removeItem("eleToken");
// 重新跳转到登录页面
router.push("/login");
}
return Promise.reject(rej);
}
);
export default axios;

```

###### 记录小问题：因为没有设置盒子模型默认为 W3C 的标准模型导致设置 width 为 100%时出现左右滚动条，设置为怪异模型就可以了

```
- {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  }

```

##### filter 过滤 分页设置显示条数

```

this.tableData = this.allTableData.filter((item, index) => {
return index < 5;
});
```

### VUE 项目 引入解析 token 的模块 jwt-decode

```
import jwt_decode from 'jwt-decode';
```
