import { collections } from '../services/database.service'

async function getNextId(collectionName: string){
  try {
    var sequenceDocument = await collections.sequencer?.findOneAndUpdate(
      { collName: collectionName },
      { $inc: { "sequence_value": 1 }},
      { returnDocument: 'after' }
    )

    return sequenceDocument?.value?.sequence_value

  } catch (err: any) {
    throw err
  }
}
export default getNextId