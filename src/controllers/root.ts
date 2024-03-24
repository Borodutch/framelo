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
import getRandomFIDPair from '@/helpers/getRandomFIDPair'
import getFIDFrame from '@/helpers/getFIDFrame'
import FIDVoteParameters from '@/validators/FIDVoteParameters'
import { FIDEntryModel } from '@/models/FIDEntry'
import getFIDImage from '@/helpers/getFIDImage'

const elo = new Elo()

@Controller('/')
export default class RootController {
  @Get('/')
  async root(@Ctx() ctx: Context) {
    ctx.response.set('Cache-Control', 'max-age=60')
    const [a, b] = await getRandomPair()
    return getFrame(a, b)
  }

  @Get('/fid')
  async fid(@Ctx() ctx: Context) {
    ctx.response.set('Cache-Control', 'max-age=60')
    const [a, b] = await getRandomFIDPair()
    return getFIDFrame(a, b)
  }

  @Post('/fid/:aFID/:bFID')
  async fidAction(
    @Params() { aFID, bFID }: FIDVoteParameters,
    @Body({ required: true })
    {
      trustedData: { messageBytes },
      untrustedData: { buttonIndex },
    }: FrameAction,
    @Ctx() ctx: Context
  ) {
    await validateSignedData(messageBytes)
    const [a, b] = await Promise.all([
      FIDEntryModel.findOne({ fid: aFID }),
      FIDEntryModel.findOne({ fid: bFID }),
    ])
    if (!a || !b) {
      return ctx.throw(notFound('Users not found'))
    }
    const outcome = elo.getOutcome(a.score, b.score, buttonIndex === 1 ? 1 : 0)
    await FIDEntryModel.updateOne(
      { fid: aFID },
      { $set: { score: outcome.a.rating }, $inc: { votes: 1 } }
    )
    await FIDEntryModel.updateOne(
      { fid: bFID },
      { $set: { score: outcome.b.rating }, $inc: { votes: 1 } }
    )
    // Return new frame
    const [newA, newB] = await getRandomFIDPair()
    console.log('Returning new frame', newA.fid, newB.fid)
    ctx.response.set('Cache-Control', 'max-age=60')
    return getFIDFrame(newA, newB)
  }

  @Post(['/', '/:aId/:bId'])
  async action(
    @Params() { aId, bId }: VoteParameters,
    @Body({ required: true })
    {
      trustedData: { messageBytes },
      untrustedData: { buttonIndex },
    }: FrameAction,
    @Ctx() ctx: Context
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
          { $set: { score: outcome.a.rating }, $inc: { votes: 1 } }
        )
        await EntryModel.updateOne(
          { _id: bId },
          { $set: { score: outcome.b.rating }, $inc: { votes: 1 } }
        )
      }
    }
    // Return new pair
    const [newA, newB] = await getRandomPair()
    ctx.response.set('Cache-Control', 'max-age=60')
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
    ctx.response.set('Content-Type', 'image/png')
    const [entryA, entryB] = await Promise.all([
      EntryModel.findById(a),
      EntryModel.findById(b),
    ])
    if (!entryA || !entryB) {
      return ctx.throw(notFound('Image not found'))
    }
    return getImage(entryA, entryB)
  }

  @Get('/fid/:aFID/:bFID')
  async fidImage(
    @Params() { aFID, bFID }: FIDVoteParameters,
    @Ctx() ctx: Context
  ) {
    ctx.response.set('Content-Type', 'image/png')
    const [entryA, entryB] = await Promise.all([
      FIDEntryModel.findOne({ fid: aFID }),
      FIDEntryModel.findOne({ fid: bFID }),
    ])
    if (!entryA || !entryB) {
      return ctx.throw(notFound('Image not found'))
    }
    return getFIDImage(entryA, entryB)
  }
}
