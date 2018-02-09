const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mongoUri = require('./config.json').uri;

mongoose.connect(mongoUri);

const Bookmark = mongoose.model('Bookmark', { 
  title: String,
  description: String,
  url: String,
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/api', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
})
app.get('/api/bookmark', async (req, res) => {
  console.log('GET  - api/bookmark');
  let bookmarks = await Bookmark.find()
  res.send(bookmarks);
});

app.put('/api/bookmark', async (req, res) => {
  console.log('PUT  - api/bookmark', req.body);
  const bookmark = Object.assign({}, req.body)
  const booky = new Bookmark({
    title: bookmark.title,
    url: bookmark.url
  });
  let newBookmark = await booky.save()
  res.send(newBookmark);
});

app.delete('/api/bookmark', async (req, res) => {
  console.log('DELETE  - api/bookmark', req.body);
  const bookmark = Object.assign({}, req.body)
  let bookmarks = await Bookmark.remove({title: bookmark.title, url:bookmark.url})
  res.send({message: 'ok'});
});

http.listen(3007, () => {
  console.log('listening on http://localhost:3007/');
});
    
