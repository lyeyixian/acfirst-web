// Firebase
const functions = require('firebase-functions')
const firebase = require('./firebase')

// Express
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello world! API working wohoo~~' })
})

// Image upload
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
})

app.post('/image', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).send({ error: 'Error: No files found!' })
    return
  }

  const blob = firebase.bucket.file(req.file.originalname)
  const blobWriter = blob.createWriteStream({
    metadata: { contentType: req.file.mimetype },
  })

  blobWriter.on('error', (err) => {
    console.log(err)
  })
  blobWriter.on('finish', () => {
    res.status(200).send({ msg: 'File uploaded successfully!' })
  })
  blobWriter.end(req.file.buffer)
})

app.post('/images', upload.array('files', 10), (req, res) => {})

exports.api = functions.https.onRequest(app)
