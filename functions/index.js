// Firebase
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// Express
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Hello world! API working wohoo~~' })
})

exports.api = functions.https.onRequest(app)
