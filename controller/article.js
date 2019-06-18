const moment = require('moment')
const conn = require('../db/index.js')
const marked = require('marked')

const showAddArticlePage = (req, res) => {
  // 如果用户没有登录，则不允许访问文章添加页
  if (!req.session.islogin) return res.redirect('/')
  res.render('./article/add.ejs', {
    user: req.session.user,
    islogin: req.session.islogin
  })
}

// 添加新文章
const addArticle = (req, res) => {
  const body = req.body
  // 如果在服务器端获取作者的Id，会有问题；如果文章编写了很长的时间，则 session 很可能会失效；
  // body.authorId = req.session.user.id
  body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
  // console.log(body)
  const sql = 'insert into blog_articles set ?'
  conn.query(sql, body, (err, result) => {
    if (err) return res.send({ msg: '发表文章失败！', status: 500 })
    // console.log(result)
    if (result.affectedRows !== 1) return res.send({ msg: '发表文章失败！', status: 501 })
    res.send({ msg: '发表文章成功！', status: 200, insertId: result.insertId })
  })
}

// 展示文章详情页
const showArticleDetail = (req, res) => {
  // 获取文章Id
  const id = req.params.id
  // 根据 Id 查询文章信息
  const sql = 'select * from blog_articles where id=?'
  conn.query(sql, id, (err, result) => {
    if (err) return res.send({ msg: '获取文章详情失败！', status: 500 })
    if (result.length !== 1) return res.redirect('/')
    // 在 调用 res.render 方法之前，要先把 markdown 文本，转为 html 文本
    const html = marked(result[0].content)
    // 把转换好的 HTML 文本，赋值给 content 属性
    result[0].content = html
    // 渲染详情页面
    res.render('./article/info.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
  })
}

// 展示编辑页面
const showEditPage = (req, res) => {
  // 如果用户没有登录，则不允许查看文章编辑页面
  if (!req.session.islogin) return res.redirect('/')
  const sql = 'select * from blog_articles where id=?'
  conn.query(sql, req.params.id, (err, result) => {
    if (err) return res.redirect('/')
    if (result.length !== 1) return res.redirect('/')
    // 渲染详情页
    res.render('./article/edit.ejs', { user: req.session.user, islogin: req.session.islogin, article: result[0] })
  })
}

// 编辑文章
const editAticle = (req, res) => {
  const sql = 'update blog_articles set ? where id=?'
  conn.query(sql, [req.body, req.body.id], (err, result) => {
    if (err) return res.send({ msg: '修改文章失败！', status: 501 })
    if (result.affectedRows !== 1) return res.send({ msg: '修改文章失败！', status: 502 })
    res.send({ msg: 'ok', status: 200 })
  })
}

module.exports = {
  showAddArticlePage,
  addArticle,
  showArticleDetail,
  showEditPage,
  editAticle
}
