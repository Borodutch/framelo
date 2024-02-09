import client from '@/helpers/client'

export default async function (fid: number) {
  for await (const userData of client.listAllUserDataByFid(fid)) {
    if (userData.data.userDataBody.type === 'USER_DATA_TYPE_PFP') {
      return userData.data.userDataBody.value
    }
  }
  return undefined
}
