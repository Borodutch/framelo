import { Entry } from '@/models/Entry'
import { FIDEntry } from '@/models/FIDEntry'
import { DocumentType } from '@typegoose/typegoose'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import {
  UltimateTextToImage,
  VerticalImage,
  getCanvasImage,
  registerFont,
} from 'ultimate-text-to-image'
import getUserByFID from '@/helpers/getUserByFID'
import { Image } from 'canvas'

registerFont(resolve(cwd(), 'fonts', 'Roboto-Regular.ttf'))

const brokenImageBuffer = readFileSync(resolve(cwd(), 'static', 'broken.jpg'))

export default async function (
  a: DocumentType<FIDEntry>,
  b: DocumentType<FIDEntry>
) {
  const userA = await getUserByFID(a.fid)
  const userB = await getUserByFID(b.fid)
  if (!userA || !userB) {
    throw new Error('User not found')
  }
  // get image a
  let imageA: Image
  try {
    imageA = await getCanvasImage({ url: userA.pfp.url })
  } catch (error) {
    if (existsSync(resolve(cwd(), 'fidImages', `${a.fid}.jpg`))) {
      imageA = await getCanvasImage({
        buffer: readFileSync(resolve(cwd(), 'fidImages', `${a.fid}.jpg`)),
      })
    } else {
      console.error(error instanceof Error ? error.message : error)
      imageA = await getCanvasImage({ buffer: brokenImageBuffer })
    }
  }
  // get image b
  let imageB: Image
  try {
    imageB = await getCanvasImage({ url: userB.pfp.url })
  } catch (error) {
    if (existsSync(resolve(cwd(), 'fidImages', `${b.fid}.jpg`))) {
      imageB = await getCanvasImage({
        buffer: readFileSync(resolve(cwd(), 'fidImages', `${b.fid}.jpg`)),
      })
    } else {
      console.error(error instanceof Error ? error.message : error)
      imageB = await getCanvasImage({ buffer: brokenImageBuffer })
    }
  }

  const title = new UltimateTextToImage('Who do you rank higher?', {
    fontFamily: 'Roboto',
    fontSize: 40,
    margin: 10,
    width: 955,
    height: 60,
    backgroundColor: '#7c65c1',
    fontColor: '#ffffff',
    align: 'center',
  })

  const imageHeight = 440

  const root = new VerticalImage([
    title,
    new UltimateTextToImage('', {
      width: 955,
      height: imageHeight,
      backgroundColor: '#7c65c1',
      images: [
        {
          canvasImage: imageA,
          layer: 0,
          repeat: 'fit',
          x: 0,
          y: 0,
          width: 477,
          height: imageHeight,
        },
        {
          canvasImage: imageB,
          layer: 1,
          repeat: 'fit',
          x: 478,
          y: 0,
          width: 477,
          height: imageHeight,
        },
      ],
    }),
  ])
  return root.render().toStream()
}
