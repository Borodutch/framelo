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
import { Image } from 'canvas'
import download from 'download'
import sharp from 'sharp'
import getPFPByFID from '@/helpers/getPFPByFID'

registerFont(resolve(cwd(), 'fonts', 'Roboto-Regular.ttf'))

const brokenImageBuffer = readFileSync(resolve(cwd(), 'static', 'broken.jpg'))

export default async function (
  a: DocumentType<FIDEntry>,
  b: DocumentType<FIDEntry>
) {
  const userAPFP = await getPFPByFID(a.fid)
  const userBPFP = await getPFPByFID(b.fid)
  // get image a
  let imageA: Image
  try {
    if (existsSync(resolve(cwd(), 'fidImages', `${a.fid}.jpg`))) {
      imageA = await getCanvasImage({
        buffer: await sharp(
          readFileSync(resolve(cwd(), 'fidImages', `${a.fid}.jpg`))
        )
          .jpeg()
          .toBuffer(),
      })
    } else {
      imageA = userAPFP
        ? await getCanvasImage({ url: userAPFP })
        : await getCanvasImage({ buffer: brokenImageBuffer })
      if (userAPFP) {
        try {
          await download(userAPFP, resolve(cwd(), 'fidImages'), {
            filename: `${a.fid}.jpg`,
          })
        } catch (error) {
          console.error(
            `Error downloading ${a.fid} pfp`,
            error instanceof Error ? error.message : error
          )
        }
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    imageA = await getCanvasImage({ buffer: brokenImageBuffer })
  }

  // get image b
  let imageB: Image
  try {
    if (existsSync(resolve(cwd(), 'fidImages', `${b.fid}.jpg`))) {
      imageB = await getCanvasImage({
        buffer: await sharp(
          readFileSync(resolve(cwd(), 'fidImages', `${b.fid}.jpg`))
        )
          .jpeg()
          .toBuffer(),
      })
    } else {
      imageB = userBPFP
        ? await getCanvasImage({ url: userBPFP })
        : await getCanvasImage({ buffer: brokenImageBuffer })
      if (userBPFP) {
        try {
          await download(userBPFP, resolve(cwd(), 'fidImages'), {
            filename: `${b.fid}.jpg`,
          })
        } catch (error) {
          console.error(
            `Error downloading ${b.fid} pfp`,
            error instanceof Error ? error.message : error
          )
        }
      }
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    imageB = await getCanvasImage({ buffer: brokenImageBuffer })
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
