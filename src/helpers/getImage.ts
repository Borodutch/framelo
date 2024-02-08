import { Entry } from '@/models/Entry'
import { DocumentType } from '@typegoose/typegoose'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'
import {
  UltimateTextToImage,
  VerticalImage,
  getCanvasImage,
  registerFont,
} from 'ultimate-text-to-image'

registerFont(resolve(cwd(), 'fonts', 'Roboto-Regular.ttf'))

export default async function (a: DocumentType<Entry>, b: DocumentType<Entry>) {
  // get buffer for image a
  const localPathA = resolve(cwd(), 'images', `${a._id}.jpg`)
  const bufferA = await readFileSync(localPathA)
  const imageA = await getCanvasImage({ buffer: bufferA })
  // get buffer for image b
  const localPathB = resolve(cwd(), 'images', `${b._id}.jpg`)
  const bufferB = await readFileSync(localPathB)
  const imageB = await getCanvasImage({ buffer: bufferB })

  const title = new UltimateTextToImage('Which do you rank higher?', {
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
