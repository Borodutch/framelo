export default function (s: string) {
  return s.length > 255 ? s.slice(0, 252) + '...' : s
}
