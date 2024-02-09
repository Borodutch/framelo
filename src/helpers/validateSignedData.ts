import { HubRestAPIClient } from '@standard-crypto/farcaster-js'

const client = new HubRestAPIClient({
  hubUrl: 'https://hub.freefarcasterhub.com:3281',
})

export default async function (messageBytes: string) {
  try {
    const response = await client.validateMessage(messageBytes)
    if (!response.valid) {
      throw new Error('Invalid signature')
    }
  } catch (error) {
    console.error(
      'Error validating signed data:',
      error instanceof Error ? error.message : error
    )
  }
}
