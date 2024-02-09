import neynar from '@/helpers/neynar'

export default function (fid: number) {
  return neynar.v1.lookupUserByFid(fid)
}
