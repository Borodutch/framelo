import { Body, Context, Controller, Ctx, Get, Params, Post } from 'amala'
import FrameAction from '@/validators/FrameAction'
import getRandomPair from '@/helpers/getRandomPair'
import getFrame from '@/helpers/getFrame'
import { EntryModel } from '@/models/Entry'
import { notFound } from '@hapi/boom'
import getImage from '@/helpers/getImage'
import ImageParameters from '@/validators/ImageParameters'
import env from '@/helpers/env'
import { resolve } from 'path'
import { cwd } from 'process'
import { createReadStream } from 'fs'

@Controller('/')
export default class RootController {
  @Get('/')
  async root() {
    const [a, b] = await getRandomPair()
    return getFrame(a, b)
  }

  @Post('/')
  async action(@Body({ required: true }) {}: FrameAction) {
    // TODO: record the action
    const [a, b] = await getRandomPair()
    return getFrame(a, b)
  }

  @Get('/og.jpg')
  og() {
    return createReadStream(resolve(cwd(), 'static', 'og.jpg'))
  }

  @Get('/random')
  async random() {
    const [a, b] = await getRandomPair()
    return [a._id, b._id, `${env.URL}/${a._id}/${b._id}`]
  }

  @Get('/:a/:b')
  async image(@Params() { a, b }: ImageParameters, @Ctx() ctx: Context) {
    const [entryA, entryB] = await Promise.all([
      EntryModel.findById(a),
      EntryModel.findById(b),
    ])
    if (!entryA || !entryB) {
      return ctx.throw(notFound('Image not found'))
    }
    return getImage(entryA, entryB)
  }
}
