import { Body, Controller, Ctx, Post } from 'amala'
import { Context } from 'koa'
import { forbidden } from '@hapi/boom'
import FrameAction from '@/validators/FrameAction'

@Controller('/')
export default class RootController {
  @Post('/')
  root() {
    return 'nice'
  }

  @Post('/action')
  action(@Body({ required: true }) {}: FrameAction, @Ctx() ctx: Context) {
    throw forbidden('You are not allowed to do this')
  }
}
