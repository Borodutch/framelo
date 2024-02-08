import 'module-alias/register'
import 'source-map-support/register'

import runApp from '@/helpers/runApp'
import runMongo from '@/helpers/mongo'
import prepareDatabase from '@/helpers/prepareDatabase'
import prepareImages from '@/helpers/prepareImages'

void (async () => {
  console.log('Done')
  console.log('Starting mongo')
  await runMongo()
  console.log('Preparing DB')
  await prepareDatabase()
  console.log('Preparing images')
  await prepareImages()
  console.log('Mongo connected')
  await runApp()
})()
