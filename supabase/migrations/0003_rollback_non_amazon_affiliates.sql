-- ============================================================
-- Migration: Remove Non-Amazon Affiliate Links & Products
-- ============================================================
-- This migration DELETES any products with non-Amazon affiliate URLs.
-- All products must link to Amazon.com (or regional Amazon domains).
-- Non-Amazon platforms (Rogue Fitness, REP Fitness, etc.) are completely removed.

-- 1. Identify products with non-Amazon affiliate URLs (for audit/logging)
create temp table non_amazon_products as
select 
  id, 
  asin,
  title, 
  affiliate_url,
  case 
    when affiliate_url is null then 'NULL'
    when affiliate_url ~ 'amazon\.' then 'VALID_AMAZON'
    when affiliate_url ~ 'amzn\.to' then 'VALID_AMAZON_SHORT'
    else 'NON_AMAZON_WILL_BE_DELETED'
  end as status
from products
where affiliate_url is not null
  and affiliate_url !~ 'amazon\.'
  and affiliate_url !~ 'amzn\.to';

-- Log the products being deleted
select 'DELETED PRODUCTS' as action, count(*) as count from non_amazon_products;

-- 2. Delete non-Amazon products (cascade deletes article_products and click_events)
delete from products
where id in (select id from non_amazon_products);

-- 3. Add constraint to prevent non-Amazon URLs going forward
-- This prevents accidental insertion of non-Amazon affiliate links
do $$ 
begin
  if not exists (
    select 1 from information_schema.table_constraints 
    where constraint_name = 'affiliate_url_amazon_only'
  ) then
    alter table products
    add constraint affiliate_url_amazon_only
    check (
      affiliate_url ~ 'amazon\.' or 
      affiliate_url ~ 'amzn\.to'
    );
  end if;
end $$;

-- 4. Verify all remaining products have valid Amazon affiliate URLs
select 
  count(*) as total_products,
  sum(case when affiliate_url ~ 'amazon\.' or affiliate_url ~ 'amzn\.to' then 1 else 0 end) as valid_amazon_urls,
  sum(case when affiliate_url is null then 1 else 0 end) as null_affiliate_urls
from products;
