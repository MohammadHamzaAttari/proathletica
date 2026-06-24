import dynamic from 'next/dynamic';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
import { CookieConsent } from '@/components/CookieConsent';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { CompareProvider } from '@/components/CompareProvider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, PINTEREST_DOMAIN_VERIFY } from '@/lib/config';
import { jsonLdProps, organizationSchema, websiteSchema } from '@/lib/seo/schema';

const ExitIntentModal = dynamic(() => import('@/components/ExitIntentModal').then(m => m.ExitIntentModal), { ssr: false });

/**
 * FIX (Audit #02-A): global metadata uses Next.js Metadata API — server-rendered.
 * Per-page titles/descriptions override these via generateMetadata() in each page.
 * FIX (Audit #02-A #5): canonical is set per-page via alternates.canonical.
 * FIX (Audit #02-H): Pinterest domain verification rendered in <head> server-side.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Best Home Fitness Gear 2026 — Expertly Tested & Ranked | ${SITE_NAME}`,
    template: `%s`, // v5: remove template suffix to avoid double brand name
  },
  description: "Discover the best home fitness gear for 2026 — ranked using 47,000+ data points by certified coaches. Compare 306 products. No paid placements.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  referrer: 'strict-origin-when-cross-origin',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Expert Fitness Gear Reviews 2026`,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Expert Fitness Gear Reviews 2026`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/manifest.json',
  // FIX (Audit #02-H): Pinterest domain verification — replace env var value in Vercel
  ...(PINTEREST_DOMAIN_VERIFY ? { other: { 'p:domain_verify': PINTEREST_DOMAIN_VERIFY } } : {}),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0D12',
  colorScheme: 'dark',
  // FIX (Audit #01-E): viewport-fit=cover for iPhone notch areas
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* FIX (Audit v3 Critical): Ensure basic Schema is in <head> for all pages */}
        <script {...jsonLdProps([organizationSchema(), websiteSchema()])} />
        {/* FIX (Audit #01-5): Preconnect to Amazon for faster product image resolution */}
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.amazon.com" crossOrigin="anonymous" />
        {/* Speculative Loading API for same-origin prefetching on hover */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prefetch: [
                {
                  where: {
                    and: [
                      { href_matches: '/*' },
                      { not: { href_matches: ['/api/*', '/admin/*'] } },
                    ],
                  },
                  eagerness: 'moderate',
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-screen bg-[#0A0D12] font-sans text-neutral-100 antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-data-lime focus:text-black focus:rounded-xl focus:font-black focus:text-sm focus:uppercase focus:tracking-wider">
          Skip to main content
        </a>
        <Header />
        <CompareProvider>
          <main id="main-content">{children}</main>
        </CompareProvider>
        <Footer year={new Date().getFullYear()} />
        <CookieConsent />
        <ExitIntentModal />

        {/* FIX (Audit #06-B): Pinterest tag — only loads when configured */}
        {process.env.NEXT_PUBLIC_PINTEREST_TAG_ID ? (
          <Script id="pinterest-tag" strategy="lazyOnload">
            {`
              !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
              n=window.pintrk;n.queue=[],n.version="3.0";var
              t=document.createElement("script");t.async=!0,t.src=e;var
              r=document.getElementsByTagName("script")[0];
              r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
              pintrk('load', '${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID}');
              pintrk('page');
            `}
          </Script>
        ) : null}
        <GoogleAnalytics gaId="G-CJPH6F4RFV" />
      </body>
    </html>
  );
}
