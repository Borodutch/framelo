import { FIDEntryModel } from '@/models/FIDEntry'

export default async function () {
  const count = 10000
  const randomA = Math.floor(Math.random() * count)
  let randomB = Math.floor(Math.random() * count)
  while (randomA === randomB) {
    randomB = Math.floor(Math.random() * count)
  }
  let a = await FIDEntryModel.findOne({
    fid: randomA,
  })
  if (!a) {
    a = await FIDEntryModel.create({
      fid: randomA,
    })
  }
  let b = await FIDEntryModel.findOne({
    fid: randomB,
  })
  if (!b) {
    b = await FIDEntryModel.create({
      fid: randomB,
    })
  }
  return [a, b]
}
