-- ============================================================
-- Migration: Add Best Adjustable Dumbbells for Small Apartments
-- ============================================================

-- 1. Insert new products
insert into products (
  id, asin, slug, category, brand, title, short_title, description, keyword,
  price_cents, currency, image_url, affiliate_url,
  rating, review_count, badge, rank, pros, cons
) values
  (
    'B08B8TLLQ4', 'B08B8TLLQ4', 'powerblock-elite-exp',
    'Home Gym', 'PowerBlock',
    'PowerBlock Elite EXP Adjustable Dumbbells',
    'PowerBlock Elite EXP',
    'The classic block design makes these the most compact adjustable dumbbells on the market. They sit flush against walls and never roll away, making them perfect for tiny apartments.',
    'compact adjustable dumbbells',
    35000, 'USD',
    'https://m.media-amazon.com/images/I/71wE7cKjQhL._AC_SL1500_.jpg',
    'https://www.amazon.com/dp/B08B8TLLQ4?tag=proathletica-20',
    4.7, 5200, 'Best for Small Spaces', 1,
    array['Extremely compact block design', 'Expandable up to 90 lbs', 'Made in the USA'],
    array['Cage design can feel restrictive', 'Changing weights requires pulling a pin']
  ),
  (
    'B09LMCX555', 'B09LMCX555', 'nordictrack-iselect',
    'Home Gym', 'NordicTrack',
    'NordicTrack iSelect Voice-Controlled Adjustable Dumbbells',
    'NordicTrack iSelect',
    'These high-tech dumbbells use a motorized dial and Alexa voice control to change weights instantly. The square plates mean they take up very little horizontal floor space.',
    'smart adjustable dumbbells',
    42900, 'USD',
    'https://m.media-amazon.com/images/I/71ZpTfK07eL._AC_SL1500_.jpg',
    'https://www.amazon.com/dp/B09LMCX555?tag=proathletica-20',
    4.4, 1800, 'Premium Pick', 3,
    array['Motorized weight changing', 'Alexa voice integration', 'Square plates save space'],
    array['Requires a power outlet', 'Lower max weight (50 lbs) than competitors']
  )
on conflict (id) do nothing;

-- 2. Insert the article
insert into articles (
  id, slug, title, excerpt, content_html, category, cluster,
  author, read_minutes, published_at, hero_image
) values (
  gen_random_uuid(),
  'best-adjustable-dumbbells-small-apartments',
  'Best Adjustable Dumbbells for Small Apartments 2026',
  'Living in a tiny apartment shouldn’t stop you from lifting heavy. We tested the most compact, space-saving adjustable dumbbells that replace an entire rack of weights.',
  '<h2>Why size matters in a small apartment</h2><p>When you live in 500 square feet, every inch counts. You do not have the luxury of a full power rack or a 10-foot row of hex dumbbells. You need a system that condenses 30 pairs of dumbbells into less than 3 square feet of space.</p><h2>What to look for</h2><ul><li><strong>Footprint:</strong> Look for square or block-shaped plates. Round plates tend to take up more horizontal space and can roll away.</li><li><strong>Max Weight:</strong> Make sure the dumbbells can grow with you. A 50lb max is fine for beginners, but advanced lifters need 90lbs+.</li><li><strong>Noise:</strong> Metal-on-metal clanking will make your downstairs neighbors hate you. Look for urethane-coated plates or tight-locking mechanisms.</li></ul><p>Here are our data-verified recommendations for the best adjustable dumbbells if you are tight on space.</p>',
  'Home Gym', 'home-gym', 'Athletica Lab', 6, now(),
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200'
) on conflict (slug) do nothing;

-- 3. Link products to the article
insert into article_products (article_id, product_id, position, custom_blurb)
select a.id, p.id, x.position, x.custom_blurb
from articles a
join (values
  ('B08B8TLLQ4', 1, 'The absolute king of space-saving. The flat edges mean you can store them flush against a wall or under a bed.'),
  ('B001ARYU58', 2, 'The industry standard. Slightly longer footprint than the PowerBlocks, but offers a more traditional dumbbell feel.'),
  ('B09LMCX555', 3, 'Perfect for apartments since the square plates keep the footprint minimal, and the digital dial makes changing weights completely silent.')
) as x(product_id, position, custom_blurb) on true
join products p on p.id = x.product_id
where a.slug = 'best-adjustable-dumbbells-small-apartments'
on conflict (article_id, product_id) do update 
  set position = excluded.position, custom_blurb = excluded.custom_blurb;
