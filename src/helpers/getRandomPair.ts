import { EntryModel } from '@/models/Entry'

export default async function () {
  const count = await EntryModel.countDocuments()
  const randomA = Math.floor(Math.random() * count)
  let randomB = Math.floor(Math.random() * count)
  while (randomA === randomB) {
    randomB = Math.floor(Math.random() * count)
  }
  const a = await EntryModel.findOne().skip(randomA)
  const b = await EntryModel.findOne().skip(randomB)
  if (!a || !b) {
    throw new Error('Failed to get a random pair')
  }
  return [a, b]
}
