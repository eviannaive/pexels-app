import { ObjectId } from "mongodb";

export type Photos = {
  imgId: string,
  imgSrc: string
}[]

export type Collections = {
  groupId: string,
  name: string,
  photos: Photos
}

export interface User {
  _id: ObjectId,
  name: string,
  email: string,
  image: string | undefined,
  collections: Collections,
  provider: string,
  createAt: Date,
  updateAt: Date,
  __v: number
}