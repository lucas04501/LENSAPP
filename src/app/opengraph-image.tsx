import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'LENS — Hiper-Produtividade';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '120px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-5px',
              fontStyle: 'italic',
            }}
          >
            LENS
          </div>
        </div>
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#A855F7',
            textTransform: 'uppercase',
            letterSpacing: '5px',
            marginTop: '10px',
          }}
        >
          Neuro-Oriented Performance
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ fontSize: '14px', color: '#505050', fontWeight: 900, letterSpacing: '2px' }}>
            STATUS: ACTIVE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
