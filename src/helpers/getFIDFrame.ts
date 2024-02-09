import { DocumentType } from '@typegoose/typegoose'
import env from '@/helpers/env'
import { FIDEntry } from '@/models/FIDEntry'
import max255Char from '@/helpers/max255Char'
import getUsernameByFID from '@/helpers/getUsernameByFID'

export default async function (
  a: DocumentType<FIDEntry>,
  b: DocumentType<FIDEntry>
) {
  const userAUsername = await getUsernameByFID(a.fid)
  const userBUsername = await getUsernameByFID(b.fid)
  return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="FramELO">
      <title>FramELO</title>

      <!-- Frame -->
      <meta property="fc:frame" content="vNext" />
      <meta property="og:image" content="${env.URL}/og.jpg" />
      <meta property="fc:frame:image" content="${env.URL}/fid/${a.fid}/${b.fid}" />
      <meta property="fc:frame:button:1" content="${max255Char(`@${userAUsername}`)}" />
      <meta property="fc:frame:button:2" content="${max255Char(`@${userBUsername}`)}" />
      <meta property="fc:frame:post_url" content="${env.URL}/fid/${a.fid}/${b.fid}" />

      <!-- Redirect -->
      <script>
        window
          .location
          .replace('https://warpcast.com/~/channel/framelo');
      </script>
    </head>
    
    <body>
      <h1>FramELO</h1>
      <h2>Because why the hell not?</h2>
    </body>
    
    </html>
    `
}
