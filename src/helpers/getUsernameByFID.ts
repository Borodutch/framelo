import client from '@/helpers/client'

export default async function (fid: number) {
  const username = await client.listUsernameProofsForFid(fid)
  return username[0]?.name || `!${fid}`
}
