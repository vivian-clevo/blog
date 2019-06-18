const conn = require('../db/index.js')

// 展示首页页面
const showIndexPage = (req, res) => {
    // 每页显示3条数据
    const pagesize = 3
    const nowpage = Number(req.query.page) || 1
        // console.log(nowpage)

    const sql = `select blog_articles.id, blog_articles.title, blog_articles.ctime, blog_users.nickname 
    from blog_articles 
    LEFT JOIN blog_users 
    ON blog_articles.authorId=blog_users.id
    ORDER BY blog_articles.id desc limit ${(nowpage - 1) * pagesize}, ${pagesize};
    select count(*) as count from blog_articles`
    conn.query(sql, (err, result) => {
        if (err) {
            return res.render('index.ejs', {
                user: req.session.user,
                islogin: req.session.islogin,
                // 文章列表
                articles: []
            })
        }

        // 总页数
        const totalPage = Math.ceil(result[1][0].count / pagesize)

        // 使用 render 函数之前，一定要保证安装和配置了 ejs 模板引擎
        res.render('index.ejs', {
            user: req.session.user,
            islogin: req.session.islogin,
            articles: result[0],
            // 总页数
            totalPage: totalPage,
            // 当前展示的是第几页
            nowpage: nowpage
        })
    })
}

module.exports = {
    showIndexPage
}