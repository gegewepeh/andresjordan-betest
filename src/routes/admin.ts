import express from 'express'
import AdminController from '../controllers/AdminController'

const router = express.Router()
router.use(express.json())

router.post('/get-token', AdminController.generateJWT)

export default router