const express = require('express')
const router = express.Router()

const ctrl = require('../controller/article.js')

// 监听客户端的 get 请求地址，显示 文章添加页面
router.get('/article/add', ctrl.showAddArticlePage)

// 监听客户端发表文章的请求
router.post('/article/add', ctrl.addArticle)

// 监听 客户端 查看文章详情的请求
router.get('/article/info/:id', ctrl.showArticleDetail)

// 监听 客户端 请求 文章编辑页面
router.get('/article/edit/:id', ctrl.showEditPage)

// 用户要编辑文章
router.post('/article/edit', ctrl.editAticle)

module.exports = router
