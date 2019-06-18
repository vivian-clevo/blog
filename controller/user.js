const moment = require('moment')
// 导入 数据库 操作模块
const conn = require('../db/index.js')
// 导入加密模块
const bcrypt = require('bcrypt')
// 定义一个 幂次
const saltRounds = 10 // 2^10

// 展示注册页面
const showRegisterPage = (req, res) => {
  // 注意：当 在 调用 模板引擎的 res.render 函数的时候， ./ 相对路径，是相对于 app.set('views') 指定的目录，来进行查找的
  res.render('./user/register.ejs', {})
}

// 展示登录页面
const showLoginPage = (req, res) => {
  res.render('./user/login.ejs', {})
}

// 注册新用户的请求处理函数
const reg = (req, res) => {
  // TODO: 完成用户注册的业务逻辑
  const body = req.body
  // 判断用户输入的数据是否完整
  if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
    return res.send({ msg: '请填写完整的表单数据后再注册用户！', status: 501 })
  }
  // 查询用户名是否重复
  const sql1 = 'select count(*) as count from blog_users where username=?'
  conn.query(sql1, body.username, (err, result) => {
    // 如果查询失败，则告知客户端失败
    if (err) return res.send({ msg: '用户名查重失败！', status: 502 })
    if (result[0].count !== 0) return res.send({ msg: '请更换其它用户名后重新注册！', status: 503 })
    // 执行注册的业务逻辑
    body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    // 在执行Sql语句之前，先对用户提供的密码，做一层加密，防止密码被泄露之后，明文被盗取的清空
    // bcrypt.hash('要被加密的密码', 循环的幂次, 回调函数)
    bcrypt.hash(body.password, saltRounds, (err, pwd) => {
      // 加密失败了！！！
      if (err) return res.send({ msg: '注册用户失败！', status: 506 })
      // 把加密之后的新密码，赋值给 body.password
      body.password = pwd
      const sql2 = 'insert into blog_users set ?'
      conn.query(sql2, body, (err, result) => {
        if (err) return res.send({ msg: '注册新用户失败！', status: 504 })
        if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败！', status: 505 })
        res.send({ msg: '注册新用户成功！', status: 200 })
      })
    })
  })
}

// 登录的请求处理函数
const login = (req, res) => {
  /* // 1. 获取到表单中的数据
  const body = req.body
  // 2. 执行Sql语句，查询用户是否存在
  const sql1 = 'select * from blog_users where username=? and password=?'
  conn.query(sql1, [body.username, body.password], (err, result) => {
    // 如果查询期间，执行Sql语句失败，则认为登录失败！
    if (err) return res.send({ msg: '用户登录失败', status: 501 })
    // 如果查询的结果，记录条数不为 1， 则证明查询失败
    if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })
    // 把 登录成功之后的用户信息，挂载到 session 上
    req.session.user = result[0]
    // 把 用户登录成功之后的结果，挂载到 session 上
    req.session.islogin = true
    // 查询成功
    res.send({ msg: 'ok', status: 200 })
  }) */

  // 1. 获取到表单中的数据
  const body = req.body
  // 2. 执行Sql语句，查询用户是否存在
  const sql1 = 'select * from blog_users where username=?'
  conn.query(sql1, [body.username], (err, result) => {
    // 如果查询期间，执行Sql语句失败，则认为登录失败！
    if (err) return res.send({ msg: '用户登录失败', status: 501 })
    // 如果查询的结果，记录条数不为 1， 则证明查询失败
    if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })

    // 对比 密码的方法
    // bcrypt.compare('用户输入的密码', '数据库中记录的密码', 回调函数)
    bcrypt.compare(body.password, result[0].password, (err, compireResult) => {
      if (err) return res.send({ msg: '用户登录失败', status: 503 })

      if (!compireResult) return res.send({ msg: '用户登录失败', status: 504 })

      // 把 登录成功之后的用户信息，挂载到 session 上
      req.session.user = result[0]
      // 把 用户登录成功之后的结果，挂载到 session 上
      req.session.islogin = true
      // 查询成功
      res.send({ msg: 'ok', status: 200 })
    })
  })
}

// 注销
const logout = (req, res) => {
  req.session.destroy(function() {
    // 使用 res.redirect 方法，可以让 客户端重新访问 指定的页面
    res.redirect('/')
  })
}

module.exports = {
  showRegisterPage,
  showLoginPage,
  reg,
  login,
  logout
}
