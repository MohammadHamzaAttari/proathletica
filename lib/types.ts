export interface Product {
  id: string;
  asin: string;
  slug: string | null;
  category: string;
  subcategory: string | null;
  brand: string | null;
  title: string;
  raw_description: string | null;
  description: string | null;
  keyword: string | null;
  price_cents: number | null;
  currency: string;
  image_url: string | null;
  affiliate_url: string;
  rating: number | null;
  review_count: number | null;
  badge: string | null;
  rank: number;
  is_featured: boolean;
  last_scraped_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  content_html: string | null;
  hero_image: string | null;
  category: string | null;
  cluster: string | null;
  author: string;
  read_minutes: number;
  published_at: string | null;
  updated_at: string;
}

export interface ArticleWithProducts extends Article {
  products: Array<Product & { position: number; custom_blurb: string | null }>;
}
