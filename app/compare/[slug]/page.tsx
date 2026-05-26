import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompareWorkspace } from '@/components/CompareWorkspace';
import { getAllProducts } from '@/lib/db';
import { buildMetadata } from '@/lib/seo/metadata';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const asins = params.slug.split('-vs-');
  if (asins.length !== 2) return { title: 'Invalid Comparison' };
  
  const products = await getAllProducts();
  const product1 = products.find(p => p.asin === asins[0] || p.id === asins[0]);
  const product2 = products.find(p => p.asin === asins[1] || p.id === asins[1]);
  
  const title1 = product1?.short_title || product1?.title || asins[0];
  const title2 = product2?.short_title || product2?.title || asins[1];

  return buildMetadata({
    title: `${title1} vs ${title2} - Which is Better?`,
    description: `Data-driven comparison between ${title1} and ${title2}. We analyze specs, verified reviews, and price to find the best choice.`,
    canonical: `/compare/${params.slug}`,
    noindex: false,
  });
}

export default async function CompareSlugPage({ params }: { params: { slug: string } }) {
  const products = await getAllProducts();
  const asins = params.slug.split('-vs-');
  
  if (asins.length < 2) {
    notFound();
  }

  const selected = products.filter((product) => asins.includes(product.id) || asins.includes(product.asin));

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0D12] pt-24 text-center text-neutral-500">Loading AI Comparison Engine...</div>}>
      <div className="container-site mx-auto pt-24 pb-8">
         <h1 className="text-3xl font-black text-offwhite uppercase tracking-tighter mb-4 text-center">
            AI Comparison Engine
         </h1>
         <p className="text-center text-neutral-400 max-w-2xl mx-auto mb-12">
            Comparing verified specs, reviews, and data between these two top products.
         </p>
      </div>
      <CompareWorkspace products={selected} />
    </Suspense>
  );
}
