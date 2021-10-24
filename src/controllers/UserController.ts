import { Request, Response, NextFunction } from 'express'
import { collections } from '../services/database.service'
import Redis from 'ioredis'
import validationErrorHelper from '../helpers/validationErrorHelper'
import getNextId from '../helpers/getNextId'
import IUser from '../interfaces/user_interface'
import IResponseObject from '../interfaces/response_interface'

export default {
  getAllUser,
  createUser,
  getByAccountNumber,
  getByIdentityNumber,
  updateUser,
  deleteUser
}

let redis: any;
if (process.env.NODE_ENV === 'production') { 
  redis = new Redis({
    port: 14471,
    host: `${process.env.REDIS_IP}`,
    password: `${process.env.REDIS_PASSWORD}`
  })
} else {
  redis = new Redis({
    port: 6379,
    host: 'redis',
  })
}

async function getAllUser(req: Request, res: Response, next: NextFunction) {
  try {
    let responseObject: IResponseObject
    const cachedUsers = await redis.get('users:all')

    if (cachedUsers) {
      responseObject = {
        httpStatus: 200,
        payload: { data: JSON.parse(cachedUsers) }
      }
    } else {
      const users = (await collections.users?.find({}).toArray()) as IUser[]
      responseObject = {
        httpStatus: 200,
        payload: { data: users }
      }
      await redis.set('users:all', JSON.stringify(users), 'ex', 86400)
    }

    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = req.body as IUser
    let responseObject: IResponseObject
    await redis.del('users:all')

    let insertedAccountNumber: number[]
    if (typeof newUser.accountNumber === 'number') {
      insertedAccountNumber = [newUser.accountNumber]
    } else {
      insertedAccountNumber = newUser.accountNumber
    }

    const user = await collections.users?.findOne({
      identityNumber: newUser.identityNumber
    })

    const createdUser = {...newUser, accountNumber: insertedAccountNumber}
    if (!user) {
      const result = await collections.users?.insertOne({
        ...createdUser,
        id: await getNextId('users')
      })

      await redis.set(`user:id_num:${newUser.identityNumber}`, JSON.stringify(createdUser))

      responseObject = {
        httpStatus: 201,
        payload: { data: { message: `Successfully created a new user with identity number ${newUser.identityNumber}`} }
      }
    } else {
      await redis.del(`user:id_num:${user.identityNumber}`)

      const insertedIdentityNumber = await collections.users?.updateOne(
        {
          identityNumber: newUser.identityNumber,
        },
        {
          $addToSet: {
            accountNumber: { $each: insertedAccountNumber}
          }
        }
      )
  
      if (!insertedIdentityNumber?.modifiedCount) {
        responseObject = {
          httpStatus: 400,
          payload: { data: { message: 'failed to create, found duplicate account number' }}
        }
      } else {
        responseObject = {
          httpStatus: 201,
          payload: { data: { message: `User with identity number ${newUser.identityNumber} already exist, added account number ${newUser.accountNumber} to the user instead.`} }
        }
      }
    }

    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    if (err.errInfo?.details.schemaRulesNotSatisfied[0]) {
      let error = validationErrorHelper(err)
      next(error)
    }
    console.log(err)
    next(err)
  }
}

async function getByAccountNumber(req: Request, res: Response, next: NextFunction) {
  try {
    let responseObject: IResponseObject
    const targetId = +req.params.accountNumber
    const cachedUserAccNum = await redis.get(`user:acc_num:${targetId}`)

    if (cachedUserAccNum) {
      responseObject = {
        httpStatus: 200,
        payload: { data: JSON.parse(cachedUserAccNum) }
      }
    } else {
      const user = await collections.users?.findOne({
        accountNumber: targetId
      })

      if (!user) {
        responseObject = {
          httpStatus: 404,
          payload: { message: "User not found" }
        }
      } else {
        responseObject = {
          httpStatus: 200,
          payload: { data: user }
        }
        await redis.set(`user:acc_num:${targetId}`, JSON.stringify(user), 'ex', 86400)
      }
    }

    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    next(err)
  }
}

async function getByIdentityNumber(req: Request, res: Response, next: NextFunction) {
  try {
    let responseObject: IResponseObject
    const targetId = +req.params.identityNumber
    const cachedUserIdNum = await redis.get(`user:id_num:${targetId}`)
    if (cachedUserIdNum) {
      responseObject = {
        httpStatus: 200,
        payload: { data: JSON.parse(cachedUserIdNum) }
      }
    } else {
      const user = await collections.users?.findOne({
        identityNumber: targetId
      })
  
      if (!user) {
        responseObject = {
          httpStatus: 404,
          payload: { message: "User not found" }
        }
      } else {
        responseObject = {
          httpStatus: 200,
          payload: { data: user }
        }
        await redis.set(`user:id_num:${targetId}`, JSON.stringify(user))
      }
    }

    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    next(err)
  }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    let responseObject: IResponseObject
    const targetId = +req.params.identityNumber
    const updateUserInput = req.body as IUser

    // delete from cache
    await redis.del('users:all')
    let cachedUser = await redis.get(`user:id_num:${targetId}`)
    if (cachedUser) {
      const cacheToBeDeleted = JSON.parse(cachedUser) 
      if (typeof cacheToBeDeleted.accountNumber === 'number') {
        await redis.del(`user:acc_num:${cacheToBeDeleted.accountNumber}`)

      } else if (Array.isArray(cacheToBeDeleted.accountNumber)) {
        cacheToBeDeleted.accountNumber.forEach(async (accNumber: number) => {
          await redis.del(`user:acc_num:${accNumber}`)
        })
      }
    }
    await redis.del(`user:id_num:${targetId}`)
    

  //update user
    let insertedAccountNumber: number[]
    if (typeof updateUserInput.accountNumber === 'number') {
      insertedAccountNumber = [updateUserInput.accountNumber]
    } else {
      insertedAccountNumber = updateUserInput.accountNumber
    }

    updateUserInput.accountNumber = insertedAccountNumber

    const updatedUser = await collections.users?.updateOne({
      identityNumber: targetId
    }, { $set: updateUserInput })

    if (!updatedUser?.modifiedCount) {
      responseObject = {
        httpStatus: 404,
        payload: { message: `User with identity number ${targetId} does not exist` }
      }
    } else {
      responseObject = {
        httpStatus: 200,
        payload: { message: `User with identity number ${updateUserInput.identityNumber} updated successfully` }
      }
    }
  
    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    next(err)
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    let responseObject: IResponseObject
    const targetId = +req.params.identityNumber

    // delete from cache
    await redis.del('users:all')
    let cachedUser = await redis.get(`user:id_num:${targetId}`)
    if (cachedUser) {
      const cacheToBeDeleted = JSON.parse(cachedUser) 
      if (typeof cacheToBeDeleted.accountNumber === 'number') {
        await redis.del(`user:acc_num:${cacheToBeDeleted.accountNumber}`)

      } else if (Array.isArray(cacheToBeDeleted.accountNumber)) {
        cacheToBeDeleted.accountNumber.forEach(async (accNumber: number) => {
          await redis.del(`user:acc_num:${accNumber}`)
        })
      }
    }
    await redis.del(`user:id_num:${targetId}`)

    // delete from db
    const deletedUser = await collections.users?.deleteOne({
      identityNumber: targetId
    })

    if (deletedUser && deletedUser.deletedCount) {
      responseObject = {
        httpStatus: 202,
        payload: { message: `Successfully removed user with identity number ${targetId}` }
      }
    } else if (!deletedUser) {
      responseObject = {
        httpStatus: 400,
        payload: { message: `Failed to remove user with identity number ${targetId}` }
      }
    } else {
      responseObject = {
        httpStatus: 404,
        payload: { message: `User with identity number ${targetId} does not exist` }
      }
    }

    res.status(responseObject.httpStatus).send(responseObject.payload)
  } catch (err: any) {
    next(err)
  }
}