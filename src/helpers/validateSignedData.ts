import { HubRestAPIClient } from '@standard-crypto/farcaster-js'

const client = new HubRestAPIClient()

export default async function (messageBytes: string) {
  const response = await client.validateMessage(messageBytes)
  if (!response.valid) {
    throw new Error('Invalid signature')
  }
}
