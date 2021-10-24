import { ObjectId } from 'mongodb'

export default interface IUser {
  _id: ObjectId;
  id: number;
  userName: string;
  accountNumber: number | number[];
  emailAddress: string;
  identityNumber: number;
}