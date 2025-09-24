import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(_: Request, { params }: { params: { code: string } }) {
  return new ImageResponse(
    (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        fontSize: 48,
      }}>
        Blooomy · {params.code}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}


