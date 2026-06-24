import { createClient } from '@supabase/supabase-js';
import { buildProductEditorialCopy } from '../lib/product-copy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kiphiogcysnyiwjaptff.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY required');
    process.exit(1);
  }

  const sb = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: products, error } = await sb
    .from('products')
    .select('*')
    .order('rank', { ascending: true })
    .limit(500);

  if (error) {
    console.error('Failed to fetch products:', error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log('No products found');
    process.exit(0);
  }

  console.log(`Found ${products.length} products`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const hasShortTitle = product.short_title?.trim();
    const hasSummary = product.editorial_summary?.trim();
    const hasPros = Array.isArray(product.pros) && product.pros.length > 0;
    const hasCons = Array.isArray(product.cons) && product.cons.length > 0;
    const hasTags = Array.isArray(product.best_for_tags) && product.best_for_tags.length > 0;

    if (hasShortTitle && hasSummary && hasPros && hasCons && hasTags) {
      skipped++;
      continue;
    }

    const copy = buildProductEditorialCopy(product);

    const { error: updateError } = await sb
      .from('products')
      .update({
        short_title: copy.short_title,
        editorial_summary: copy.editorial_summary,
        pros: copy.pros,
        cons: copy.cons,
        best_for_tags: copy.best_for_tags,
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  Failed to update ${product.id} (${product.title}): ${updateError.message}`);
    } else {
      updated++;
      console.log(`  Updated: ${product.title.slice(0, 60)}`);
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
}

main().catch(console.error);