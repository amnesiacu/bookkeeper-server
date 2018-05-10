const app = require('express')()
const http = require('http').Server(app)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const {uri, port} = require('./config.json')

mongoose.connect(uri)

const Bookmark = mongoose.model('Bookmark', {
  title: String,
  description: String,
  url: String
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', async (req, res) => {
  res.sendFile('/index.html', {root: './'})
})

app.get('/api', async (req, res) => {
  res.sendFile('/index.html', {root: './'})
})

app.get('/api/bookmark', async (req, res) => {
  let bookmarks = await Bookmark.find()
  res.send(bookmarks)
})

app.put('/api/bookmark', async (req, res) => {
  const bookmark = Object.assign({}, req.body)
  const booky = new Bookmark({
    title: bookmark.title,
    url: bookmark.url
  })
  let newBookmark = await booky.save()
  res.send(newBookmark)
})

app.delete('/api/bookmark', async (req, res) => {
  const bookmark = Object.assign({}, req.body)
  await Bookmark.remove({title: bookmark.title, url: bookmark.url})
  res.send({message: 'ok'})
})

http.listen(port, () => {
  console.log(`listening on localhost:${port}/`)
})
