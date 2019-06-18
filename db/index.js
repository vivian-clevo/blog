const mysql = require('mysql')

const conn = mysql.createConnection({
  host: '127.0.0.1',
  database: 'mysql_001',
  user: 'root',
  password: 'root',
  // 开启执行多条Sql语句的功能
  multipleStatements: true
})

// 把当前模块中创建的 conn 数据库连接对象，暴露出去
module.exports = conn
