const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

//if env is test, use test database
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST: MONGO_DB_URI

if (!connectionString) {
  console.error('URI is missing!')
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useFindAndModify: false,
  //useCreateIndex: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})