import DatasetEntry from '@/models/DatasetEntry'
import { EntryModel } from '@/models/Entry'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'

export default async function () {
  console.log('Checking if database is ready...')
  const count = await EntryModel.countDocuments()
  if (count > 0) {
    console.log('Database is ready')
    return
  }
  const data = JSON.parse(
    readFileSync(resolve(cwd(), 'data', 'dataset.json'), 'utf-8')
  ) as DatasetEntry[]
  console.log(
    `Got ${data.length} entries from dataset.json, saving to database...`
  )
  for (const entry of data) {
    if (!entry.image) {
      continue
    }
    const model = new EntryModel({
      title: entry.name,
      imageURL: entry.image,
    })
    await model.save()
  }
  console.log('Database is ready')
}
