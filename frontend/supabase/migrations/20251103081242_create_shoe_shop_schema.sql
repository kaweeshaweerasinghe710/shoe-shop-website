/*
  # Shoe Shop Database Schema

  ## Overview
  Creates the complete database schema for the shoe shop application including products, categories, cart, reviews, and user profiles.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text) - Category name (e.g., Bags, Shoes, Slippers)
  - `slug` (text, unique) - URL-friendly category identifier
  - `image_url` (text) - Category display image
  - `created_at` (timestamptz) - Record creation timestamp

  ### `products`
  - `id` (uuid, primary key) - Unique identifier for each product
  - `category_id` (uuid, foreign key) - References categories table
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (decimal) - Product price
  - `brand` (text) - Product brand
  - `image_url` (text) - Product image URL
  - `is_featured` (boolean) - Whether product is featured on home page
  - `discount_percentage` (integer) - Discount percentage if any
  - `created_at` (timestamptz) - Record creation timestamp

  ### `cart_items`
  - `id` (uuid, primary key) - Unique identifier for each cart item
  - `user_id` (uuid) - User who added the item (auth.users reference)
  - `product_id` (uuid, foreign key) - References products table
  - `quantity` (integer) - Number of items
  - `created_at` (timestamptz) - Record creation timestamp

  ### `reviews`
  - `id` (uuid, primary key) - Unique identifier for each review
  - `product_id` (uuid, foreign key) - References products table
  - `user_id` (uuid) - User who submitted review
  - `user_name` (text) - Reviewer's name
  - `user_photo_url` (text) - Reviewer's photo
  - `rating` (integer) - Rating from 1-5
  - `comment` (text) - Review text
  - `created_at` (timestamptz) - Record creation timestamp

  ### `user_profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `name` (text) - User full name
  - `photo_url` (text) - User profile photo
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for categories, products, and reviews
  - Authenticated users can manage their own cart items
  - Authenticated users can create reviews
  - Users can only view/update their own profiles
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  brand text NOT NULL,
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  discount_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid,
  user_name text NOT NULL,
  user_photo_url text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products policies (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Cart policies (users manage their own cart)
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reviews policies (public read, authenticated create)
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert sample categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Shoes', 'shoes', 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'),
  ('Bags', 'bags', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'),
  ('Slippers', 'slippers', 'https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg'),
  ('Stationary', 'stationary', 'https://images.pexels.com/photos/159519/back-to-school-paper-colored-paper-stationery-159519.jpeg'),
  ('Hats', 'hats', 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, description, price, brand, image_url, is_featured, discount_percentage) 
SELECT 
  c.id,
  'Classic Leather Sneakers',
  'Comfortable and stylish leather sneakers perfect for everyday wear',
  89.99,
  'Nike',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  true,
  20
FROM categories c WHERE c.slug = 'shoes'
ON CONFLICT DO NOTHING;

INSERT INTO products (category_id, name, description, price, brand, image_url, is_featured, discount_percentage) 
SELECT 
  c.id,
  'Premium Canvas Backpack',
  'Durable canvas backpack with multiple compartments',
  49.99,
  'Herschel',
  'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
  true,
  15
FROM categories c WHERE c.slug = 'bags'
ON CONFLICT DO NOTHING;

INSERT INTO products (category_id, name, description, price, brand, image_url, is_featured, discount_percentage) 
SELECT 
  c.id,
  'Cozy Home Slippers',
  'Soft and comfortable slippers for indoor use',
  24.99,
  'Comfort Plus',
  'https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg',
  true,
  10
FROM categories c WHERE c.slug = 'slippers'
ON CONFLICT DO NOTHING;