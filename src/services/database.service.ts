// External Dependencies
import * as mongoDB from 'mongodb'
import * as dotenv from 'dotenv'
import { userSchema } from '../models/User'

// Global Variables (method .findAndModify is not recognized in typescript(bug), for temporary solution, any is used as sequencer type here)
export const collections: { users?: mongoDB.Collection, sequencer?: mongoDB.Collection } = {}

// Initialize Connection
export async function connectToDatabaseAtlas () {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING ? process.env.DB_CONN_STRING : 'no-connection-str');      
  await client.connect();
      
  const db: mongoDB.Db = client.db(process.env.DB_NAME)

  const usersCollection: mongoDB.Collection = db.collection(process.env.DB_COLLECTION_NAME ? process.env.DB_COLLECTION_NAME : 'users');
  const sequencerCollection: mongoDB.Collection = db.collection('sequencer')

  collections.users = usersCollection
  collections.sequencer = sequencerCollection

  db.listCollections({ name: 'users' })
    .next(function(err, collinfo) {
      if (!collinfo) {
        db.createCollection('users', userSchema)
        collections.users?.createIndex({ id: 1 }, { unique: true })
        collections.users?.createIndex({ userName: 1 }, { unique: true })
        collections.users?.createIndex({ emailAddress: 1 }, { unique: true })
        collections.users?.createIndex({ identityNumber: 1 }, { unique: true })
        collections.users?.createIndex({ accountNumber: 1 }, { unique: true })
      }
    })
  db.listCollections({ name: 'sequencer' })
    .next(function(err, collinfo) {
      if (!collinfo) {
        db.createCollection('sequencer')
        collections.sequencer?.insertOne({
          collName: 'users',
          sequence_value: 0
        })
      }
    })

  console.log(`Successfully connected to ATLAS database: ${db.databaseName}`);
}

export async function connectToDatabaseLocal () {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_LOCAL_CONN_STRING ? process.env.DB_LOCAL_CONN_STRING : 'mongodb://localhost:27017/db_andresjordan_betest');
  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME)

  const usersCollection: mongoDB.Collection = db.collection(process.env.DB_COLLECTION_NAME ? process.env.DB_COLLECTION_NAME : 'users');
  const sequencerCollection: mongoDB.Collection = db.collection('sequencer')

  collections.users = usersCollection
  collections.sequencer = sequencerCollection

  db.listCollections({ name: 'users' })
    .next(function(err, collinfo) {
      if (!collinfo) {
        db.createCollection('users', userSchema)
        collections.users?.createIndex({ id: 1 }, { unique: true })
        collections.users?.createIndex({ userName: 1 }, { unique: true })
        collections.users?.createIndex({ emailAddress: 1 }, { unique: true })
        collections.users?.createIndex({ identityNumber: 1 }, { unique: true })
        collections.users?.createIndex({ accountNumber: 1 }, { unique: true })
      }
    })
  db.listCollections({ name: 'sequencer' })
    .next(function(err, collinfo) {
      if (!collinfo) {
        db.createCollection('sequencer')
        collections.sequencer?.insertOne({
          collName: 'users',
          sequence_value: 0
        })
      }
    })

  console.log(`Successfully connected to LOCAL database: ${db.databaseName}`);
}