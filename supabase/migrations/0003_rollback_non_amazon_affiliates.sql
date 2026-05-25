-- ============================================================
-- Migration: Rollback to Amazon-only Affiliate Links
-- ============================================================
-- This migration removes any non-Amazon affiliate URLs from the products table.
-- All products must link to Amazon.com (or regional Amazon domains).
-- Non-Amazon platforms (Rogue Fitness, REP Fitness, etc.) are not supported.

-- 1. Identify and log products with non-Amazon affiliate URLs
-- (Run this query to see what will be changed)
select 
  id, 
  title, 
  affiliate_url,
  case 
    when affiliate_url is null then 'NULL'
    when affiliate_url ~ 'amazon\.' then 'VALID_AMAZON'
    when affiliate_url ~ 'amzn\.to' then 'VALID_AMAZON_SHORT'
    else 'NON_AMAZON_WILL_BE_REMOVED'
  end as status
from products
where affiliate_url is not null
  and affiliate_url !~ 'amazon\.'
  and affiliate_url !~ 'amzn\.to';

-- 2. Remove non-Amazon affiliate URLs
-- Products with non-Amazon links will have their affiliate_url set to NULL
-- (they should already have Amazon ASINs that can be used to construct links)
update products
set affiliate_url = null,
    updated_at = now()
where affiliate_url is not null
  and affiliate_url !~ 'amazon\.'
  and affiliate_url !~ 'amzn\.to';

-- 3. Add constraint to prevent non-Amazon URLs in the future (optional)
-- This ensures only Amazon URLs are allowed going forward
-- Uncomment if you want to enforce this at the database level:

-- alter table products
-- add constraint affiliate_url_amazon_only
-- check (
--   affiliate_url is null or 
--   affiliate_url ~ 'amazon\.' or 
--   affiliate_url ~ 'amzn\.to'
-- );

-- 4. Verify results
select 
  count(*) as total_products,
  sum(case when affiliate_url is null then 1 else 0 end) as null_affiliate_urls,
  sum(case when affiliate_url ~ 'amazon\.' or affiliate_url ~ 'amzn\.to' then 1 else 0 end) as valid_amazon_urls
from products;
