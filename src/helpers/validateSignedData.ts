import client from '@/helpers/client'

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
