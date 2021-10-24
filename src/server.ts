import app from './app'
import { connectToDatabaseAtlas, connectToDatabaseLocal } from './services/database.service'
const PORT: number = Number(process.env.DB_APP_PORT) || 4000

console.log(process.env.NODE_ENV, PORT, 'masuk terupdate 5')

if (process.env.NODE_ENV === 'production') {
  connectToDatabaseAtlas()
  .then(_ => {
    app.listen(PORT, () => {
      console.log("App running at port " + PORT)
    })
  })
  .catch (err => {
    console.log('mongoDB connect error')
    console.log(err)
  })
} else {
  connectToDatabaseLocal()
    .then(_ => {
      app.listen(PORT, () => {
        console.log("App running at port " + PORT)
      })
    })
    .catch (err => {
      console.log('mongoDB connect error')
      console.log(err)
    })
}

