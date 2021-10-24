import app from './app'
import { connectToDatabaseAtlas, connectToDatabaseLocal } from './services/database.service'
const PORT: number = Number(process.env.APP_PORT) || 4000

if (process.env.NODE_ENV === 'production') {
  connectToDatabaseAtlas()
  .then(_ => {
    app.listen(PORT, () => {
      console.log("App running at port " + PORT)
    })
  })
  .catch (err => {
    console.log('mongoDB connect error')
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
    })
}

