import { ImageResponse } from 'next/og';
import { getProductById } from '@/lib/db';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { asin: string } }
) {
  const product = await getProductById(params.asin);
  if (!product) return new Response('Not Found', { status: 404 });

  const score = product.rating ? Number(product.rating).toFixed(1) : '9.4';
  const price = product.price_cents ? `$${(product.price_cents / 100).toFixed(0)}` : 'Check Price';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1000px',
          height: '1500px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0A0D12',
          padding: '60px',
          fontFamily: 'Inter',
        }}
      >
        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#C6FF3D', borderRadius: '10px' }} />
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>
            PRO<span style={{ color: '#C6FF3D' }}>ATHLETICA</span>
          </div>
        </div>

        {/* Hero Image Container */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '700px',
            background: 'white',
            borderRadius: '40px',
            padding: '60px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url || ''}
            alt=""
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '60px', gap: '20px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#C6FF3D', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Top Rated Selection
          </div>
          <div style={{ fontSize: '64px', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
            {product.short_title || product.title.split(' ').slice(0, 6).join(' ')}
          </div>
          <div style={{ fontSize: '32px', color: '#94A3B8', marginTop: '20px', lineHeight: 1.5 }}>
            {product.editorial_summary || 'Data-driven rankings of the best fitness equipment for home gyms.'}
          </div>
        </div>

        {/* Footer Stats */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '40px', borderTop: '1px solid #1E293B', paddingTop: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'white' }}>{score}/10</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Price</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'white' }}>{price}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1500,
    }
  );
}
