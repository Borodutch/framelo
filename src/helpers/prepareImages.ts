import { EntryModel } from '@/models/Entry'
import download from 'download'
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import maxFID from '@/helpers/maxFID'
import getPFPByFID from './getPFPByFID'

async function prepareFidImages() {
  console.log('Now to FID images...')
  const fidFiles = readdirSync(resolve(cwd(), 'fidImages'))
  for (let i = 1; i <= maxFID; i++) {
    const filename = `${i}.jpg`
    const fileExists = fidFiles.includes(filename)
    if (fileExists) {
      continue
    }
    console.log(`Downloading image for FID ${i}...`)
    const pfpUrl = await getPFPByFID(i)
    if (!pfpUrl) {
      continue
    }
    try {
      console.log(`Downloading ${pfpUrl}`)
      await download(pfpUrl, resolve(cwd(), 'fidImages'), {
        filename,
      })
      await delay(5)
    } catch (error) {
      console.error(
        `Error downloading image for FID ${i}: ${
          error instanceof Error ? error.message : error
        }`
      )
    }
  }
  console.log('All FID images downloaded')
}

function delay(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000))
}

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
  void prepareFidImages()
}
