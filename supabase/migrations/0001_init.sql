-- ============================================================
-- ProAthletica — Supabase schema v1
-- Run via: Supabase Dashboard → SQL Editor → Paste + Run
-- Or: supabase db push (if using CLI)
-- ============================================================

create extension if not exists pgcrypto;

-- ─── products ────────────────────────────────────────────────
create table if not exists products (
  id              text primary key,
  asin            text not null unique,
  slug            text unique,
  category        text not null,
  subcategory     text,
  brand           text,
  title           text not null,
  description     text,
  keyword         text,
  price_cents     integer,
  currency        text default 'USD',
  image_url       text,
  affiliate_url   text not null,
  rating          numeric(3,2),
  review_count    integer default 0,
  badge           text,
  rank            integer default 999,
  is_featured     boolean default false,
  last_scraped_at timestamptz default now(),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_price    on products(price_cents);
create index if not exists idx_products_rating   on products(rating desc);
create index if not exists idx_products_slug     on products(slug);
create index if not exists idx_products_rank     on products(rank);

-- ─── articles ────────────────────────────────────────────────
create table if not exists articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content_md    text,
  content_html  text,
  hero_image    text,
  category      text,
  cluster       text,
  author        text default 'Athletica Lab',
  read_minutes  integer default 5,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists idx_articles_published on articles(published_at desc)
  where published_at is not null;
create index if not exists idx_articles_cluster on articles(cluster);

-- ─── article_products (M2M) ──────────────────────────────────
create table if not exists article_products (
  article_id  uuid references articles(id) on delete cascade,
  product_id  text references products(id) on delete cascade,
  position    integer not null default 0,
  custom_blurb text,
  primary key (article_id, product_id)
);

create index if not exists idx_article_products_article
  on article_products(article_id, position);

-- ─── click_events ────────────────────────────────────────────
create table if not exists click_events (
  id           uuid primary key default gen_random_uuid(),
  product_id   text,
  article_slug text,
  rank         integer,
  country      text,
  referrer     text,
  user_agent   text,
  ip_hash      text,
  created_at   timestamptz default now()
);

create index if not exists idx_clicks_product
  on click_events(product_id, created_at desc);
create index if not exists idx_clicks_article
  on click_events(article_slug, created_at desc);
create index if not exists idx_clicks_created
  on click_events(created_at desc);

-- ─── subscribers ─────────────────────────────────────────────
create table if not exists subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text unique not null,
  source           text,
  convertkit_id    text,
  status           text default 'active',
  created_at       timestamptz default now(),
  unsubscribed_at  timestamptz
);

create index if not exists idx_subscribers_status
  on subscribers(status, created_at desc);

-- ─── Row Level Security ──────────────────────────────────────
alter table products         enable row level security;
alter table articles         enable row level security;
alter table article_products enable row level security;
alter table click_events     enable row level security;
alter table subscribers      enable row level security;

-- Public read access for anon key (site reads)
drop policy if exists "anon read products"         on products;
create policy "anon read products"         on products         for select using (true);

drop policy if exists "anon read articles"         on articles;
create policy "anon read articles"         on articles         for select using (published_at is not null);

drop policy if exists "anon read article_products" on article_products;
create policy "anon read article_products" on article_products for select using (true);

-- ─── updated_at trigger ──────────────────────────────────────
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products for each row execute function set_updated_at();

drop trigger if exists articles_updated_at on articles;
create trigger articles_updated_at
  before update on articles for each row execute function set_updated_at();

-- ─── Seed data (safe to re-run) ──────────────────────────────
insert into products (
  id, asin, slug, category, brand, title, description, keyword,
  price_cents, currency, image_url, affiliate_url,
  rating, review_count, badge, rank, is_featured
) values
  (
    ('B001ARYU58', 'B001ARYU58', 'bowflex-selecttech-552',
     'Home Gym', 'Bowflex',
     'Bowflex SelectTech 552 Adjustable Dumbbells',
     'Compact adjustable dumbbells that replace a full rack for beginner home gyms.',
    'adjustable dumbbells home gym',
    34900, 'USD',
    null,
     'https://www.amazon.com/dp/B001ARYU58?tag=proathletica-20&linkCode=ll1&language=en_US',
    4.8, 32000, '#1 Best Seller', 1, true
  ),
  (
    'B099JZT1WR', 'B099JZT1WR', 'yoleo-adjustable-weight-bench',
    'Home Gym', 'YOLEO',
    'YOLEO Adjustable Weight Bench',
    'Adjustable bench with multiple incline positions and a compact footprint.',
    'adjustable bench home gym',
    12999, 'USD',
    'https://m.media-amazon.com/images/I/81pu4FK5uSL._AC_UL320_.jpg',
    'https://www.amazon.com/dp/B099JZT1WR?tag=proathletica-20',
    4.7, 5100, 'Top Rated', 2, true
  ),
  (
    'B01AVDVHTI', 'B01AVDVHTI', 'fit-simplify-resistance-loop-bands',
    'Home Gym', 'Fit Simplify',
    'Fit Simplify Resistance Loop Bands',
    'Set of loop bands for warmups, rehab, and glute activation.',
    'resistance loop bands',
    1295, 'USD',
    'https://m.media-amazon.com/images/I/81N-kCHRqaL._AC_SX679_.jpg',
    'https://www.amazon.com/dp/B01AVDVHTI?tag=proathletica-20',
    4.5, 85000, 'Best Value', 3, true
  )
on conflict (id) do nothing;

insert into articles (
  slug, title, excerpt, content_html, category, cluster,
  author, read_minutes, published_at, hero_image
) values (
  'best-home-gym-equipment-2026',
  'Best Home Gym Equipment for Beginners 2026',
  'Building a home gym does not have to cost thousands. We vetted the essentials that matter most.',
  '<h2>Why most home gyms fail</h2><p>The fastest way to waste money is to buy too much too early. Start with adjustable resistance, a stable bench, and the accessories that let you train consistently.</p><h2>The essential three</h2><ol><li><strong>Adjustable tension</strong> for scalable workouts.</li><li><strong>A bench that feels stable</strong> under load.</li><li><strong>Low-cost accessories</strong> that increase exercise variety.</li></ol>',
  'Home Gym', 'home-gym', 'Athletica Lab', 8, now(),
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200'
) on conflict (slug) do nothing;

insert into article_products (article_id, product_id, position, custom_blurb)
select a.id, p.id, x.position, x.custom_blurb
from articles a
join (values
  ('B001ARYU58', 0, 'A high-utility adjustable dumbbell set that eliminates the need for a full beginner rack.'),
  ('B099JZT1WR', 1, 'A compact adjustable bench that adds pressing, rows, step-ups, and split-squat options.'),
  ('B01AVDVHTI', 2, 'A low-cost band set that adds warm-up, rehab, and accessory work without taking space.')
) as x(product_id, position, custom_blurb) on true
join products p on p.id = x.product_id
where a.slug = 'best-home-gym-equipment-2026'
on conflict (article_id, product_id) do nothing;
