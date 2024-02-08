import { EntryModel } from '@/models/Entry'
import download from 'download'
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'

export default async function () {
  const path = resolve(cwd(), 'images')
  const files = readdirSync(path)
  console.log(
    `Got ${files.length} files in images directory, preparing to download any missing images...`
  )
  const entries = await EntryModel.find()
  let i = 0
  for (const entry of entries) {
    const filename = `${entry._id}.jpg`
    const fileExists = files.includes(filename)
    if (fileExists) {
      continue
    }
    console.log(`Downloading ${entry.title} (${++i}/${entries.length})...`)
    try {
      await download(entry.imageURL, path, {
        filename,
      })
    } catch (error) {
      console.error(
        `Error downloading ${entry.title}: ${error instanceof Error ? error.message : error}`
      )
      await EntryModel.findByIdAndDelete(entry._id)
      continue
    }
    console.log(`Downloaded ${entry.title} to ${path}/${filename}`)
  }
  console.log('All images downloaded')
}
