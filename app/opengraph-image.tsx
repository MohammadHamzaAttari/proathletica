import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '72px',
          background: 'linear-gradient(135deg, #050505 0%, #0f172a 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 28, color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
          ProAthletica
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, marginTop: 20 }}>
          Tested Gear.
          <br />
          Real Athletes.
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: '#a3a3a3' }}>
          Independent buyer guides for fitness gear and home gym equipment.
        </div>
      </div>
    ),
    { ...size }
  );
}
