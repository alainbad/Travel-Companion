-- TravelHub Seed Data
-- Run after schema.sql

-- Destinations
insert into destinations (name, country, city, description, image_url, is_featured) values
  ('Dubai', 'UAE', 'Dubai', 'The city of luxury, innovation, and endless experiences in the heart of the Middle East.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', true),
  ('Paris', 'France', 'Paris', 'The City of Light — romance, art, haute cuisine, and timeless architecture.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', true),
  ('Bali', 'Indonesia', 'Bali', 'Tropical paradise with emerald rice terraces, ancient temples, and world-class surf.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', true),
  ('New York', 'USA', 'New York City', 'The city that never sleeps — culture, food, fashion, and iconic skyline.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', true),
  ('Tokyo', 'Japan', 'Tokyo', 'Where ancient tradition meets futuristic innovation in the world''s greatest metropolis.', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', true),
  ('Maldives', 'Maldives', 'Malé', 'Crystal blue lagoons, overwater bungalows, and pristine white sand beaches.', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800', true),
  ('London', 'UK', 'London', 'Historic grandeur, royal palaces, world-class museums, and vibrant culture.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', false),
  ('Barcelona', 'Spain', 'Barcelona', 'Gaudí masterpieces, sun-soaked beaches, and a legendary food and nightlife scene.', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', true);

-- Amenities
insert into amenities (name, icon, category) values
  ('Free WiFi', 'wifi', 'connectivity'),
  ('Swimming Pool', 'waves', 'leisure'),
  ('Spa & Wellness', 'sparkles', 'wellness'),
  ('Fitness Center', 'dumbbell', 'wellness'),
  ('Restaurant', 'utensils', 'dining'),
  ('Room Service', 'clock', 'dining'),
  ('Airport Transfer', 'plane', 'transport'),
  ('Parking', 'car', 'transport'),
  ('Beach Access', 'sun', 'leisure'),
  ('Kids Club', 'baby', 'family'),
  ('Business Center', 'briefcase', 'business'),
  ('Concierge', 'bell', 'service'),
  ('Air Conditioning', 'wind', 'room'),
  ('Pet Friendly', 'paw-print', 'service'),
  ('Bar & Lounge', 'wine', 'dining');

-- Hotels (using Dubai destination)
-- Note: You'll need to replace destination_id with actual UUIDs after running schema.sql
-- These are example inserts — use the Supabase dashboard or update with real UUIDs

insert into hotels (name, slug, description, address, city, country, star_rating, guest_rating, review_count, main_image_url, is_featured, status)
values
  (
    'Burj Al Arab',
    'burj-al-arab',
    'The world''s most luxurious hotel, an iconic sail-shaped tower rising from its own private island. The Burj Al Arab offers unrivaled all-butler suite service with panoramic Arabian Gulf views.',
    'Jumeirah Beach Road, Jumeirah 3',
    'Dubai', 'UAE', 5, 9.6, 2847,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    true, 'active'
  ),
  (
    'Atlantis The Palm',
    'atlantis-the-palm',
    'A spectacular resort destination on the iconic Palm Jumeirah, featuring Aquaventure Waterpark, The Lost Chambers Aquarium, and over 40 restaurants and bars.',
    'Crescent Road, The Palm Jumeirah',
    'Dubai', 'UAE', 5, 9.1, 5231,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    true, 'active'
  ),
  (
    'Four Seasons Resort Bali at Sayan',
    'four-seasons-bali-sayan',
    'Perched above the Ayung River gorge in the cultural heart of Bali, this hideaway retreat blends Balinese traditions with contemporary luxury surrounded by jungle and terraced rice paddies.',
    'Sayan, Ubud',
    'Bali', 'Indonesia', 5, 9.4, 1892,
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    true, 'active'
  ),
  (
    'The Ritz Paris',
    'ritz-paris',
    'An institution of French luxury since 1898, the Ritz Paris combines imperial grandeur with intimate elegance in the heart of Place Vendôme.',
    '15 Place Vendôme',
    'Paris', 'France', 5, 9.5, 3102,
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    true, 'active'
  ),
  (
    'The Peninsula New York',
    'peninsula-new-york',
    'A legendary Fifth Avenue address offering impeccable service, breathtaking city views, and the finest accommodations in Midtown Manhattan.',
    '700 Fifth Avenue at 55th Street',
    'New York City', 'USA', 5, 9.2, 2456,
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    false, 'active'
  ),
  (
    'Anantara Veli Maldives Resort',
    'anantara-veli-maldives',
    'An adults-only paradise of overwater bungalows set above the turquoise Indian Ocean, with a stunning house reef and world-class diving right at your doorstep.',
    'South Malé Atoll',
    'Maldives', 'Maldives', 5, 9.7, 987,
    'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
    true, 'active'
  );
