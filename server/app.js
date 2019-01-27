let express = require('express')
let fs = require('fs')
let path = require('path')
let bodyParser = require('body-parser')

let app = express()

// 訪問靜態資源
app.use(express.static(path.resolve(__dirname, '../dist')))

// 訪問單頁
app.get('*', function (req, res) {
  let html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  res.send(html)
})

// 監聽
app.listen(9001, 'localhost', function () {
  console.log('success listen... 9001')
})
