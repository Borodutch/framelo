import { NeynarAPIClient } from '@standard-crypto/farcaster-js'
import env from '@/helpers/env'

const client = new NeynarAPIClient(env.NEYNAR_API_KEY)

export default function (fid: number) {
  return client.v1.lookupUserByFid(fid)
}
