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
import VoteParameters from '@/validators/VoteParameters'
import validateSignedData from '@/helpers/validateSignedData'
import Elo from '@pelevesque/elo'

const elo = new Elo()

@Controller('/')
export default class RootController {
  @Get('/')
  async root() {
    const [a, b] = await getRandomPair()
    return getFrame(a, b)
  }

  @Post(['/', '/:aId/:bId'])
  async action(
    @Params() { aId, bId }: VoteParameters,
    @Body({ required: true })
    {
      trustedData: { messageBytes },
      untrustedData: { url, buttonIndex },
    }: FrameAction
  ) {
    await validateSignedData(messageBytes)
    if (aId && bId) {
      const [a, b] = await Promise.all([
        EntryModel.findById(aId),
        EntryModel.findById(bId),
      ])
      if (a && b) {
        const outcome = elo.getOutcome(
          a.score,
          b.score,
          buttonIndex === 1 ? 1 : 0
        )
        await EntryModel.updateOne(
          { _id: aId },
          { $set: { score: outcome.a.rating } }
        )
        await EntryModel.updateOne(
          { _id: bId },
          { $set: { score: outcome.b.rating } }
        )
      }
    }
    const [newA, newB] = await getRandomPair()
    return getFrame(newA, newB)
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
