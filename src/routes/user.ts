import express from 'express'
import UserController from '../controllers/UserController'
import authenticate from '../middlewares/auth'

const router = express.Router()
router.use(express.json())

// GET
router.get('/', authenticate, UserController.getAllUser)
router.get('/account-number/:accountNumber', authenticate, UserController.getByAccountNumber)
router.get('/identity-number/:identityNumber', authenticate, UserController.getByIdentityNumber)

// POST
router.post('/', authenticate, UserController.createUser)
// PUT
router.put('/:identityNumber', authenticate, UserController.updateUser)

// DELETE
router.delete('/:identityNumber', authenticate, UserController.deleteUser)

export default router