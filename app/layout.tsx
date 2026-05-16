import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { CookieConsent } from '@/components/CookieConsent';
import { ExitIntentModal } from '@/components/ExitIntentModal';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, PINTEREST_DOMAIN_VERIFY } from '@/lib/config';
import { jsonLdProps, organizationSchema, websiteSchema } from '@/lib/seo/schema';

/**
 * FIX (Audit #02-A): global metadata uses Next.js Metadata API — server-rendered.
 * Per-page titles/descriptions override these via generateMetadata() in each page.
 * FIX (Audit #02-A #5): canonical is set per-page via alternates.canonical.
 * FIX (Audit #02-H): Pinterest domain verification rendered in <head> server-side.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Best Fitness Gear 2026 — Tested & Reviewed`,
    template: '%s',
  },
  description: SITE_DESCRIPTION,
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
        {/* FIX: Organization + WebSite schema in <head> for all pages */}
        <script {...jsonLdProps([organizationSchema(), websiteSchema()])} />
        {/* FIX (Audit #01-5): Preconnect to Amazon for faster product image resolution */}
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.amazon.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0A0D12] font-sans text-neutral-100 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
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
