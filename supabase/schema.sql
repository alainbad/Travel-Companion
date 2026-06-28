-- TravelHub Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  role text default 'user' check (role in ('user', 'partner', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profiles for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- DESTINATIONS
-- ============================================================
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  city text,
  description text,
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);

alter table destinations enable row level security;

create policy "Anyone can view destinations"
  on destinations for select using (true);

create policy "Admins can manage destinations"
  on destinations for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- HOTELS
-- ============================================================
create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  destination_id uuid references destinations(id),
  name text not null,
  slug text unique,
  description text,
  address text,
  city text,
  country text,
  latitude numeric,
  longitude numeric,
  star_rating int check (star_rating between 1 and 5),
  guest_rating numeric check (guest_rating between 0 and 10),
  review_count int default 0,
  main_image_url text,
  is_featured boolean default false,
  status text default 'draft' check (status in ('draft', 'active', 'inactive')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table hotels enable row level security;

create policy "Anyone can view active hotels"
  on hotels for select using (status = 'active');

create policy "Partners can manage their own hotels"
  on hotels for all using (
    auth.uid() = owner_id
    or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- HOTEL IMAGES
-- ============================================================
create table if not exists hotel_images (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

alter table hotel_images enable row level security;

create policy "Anyone can view hotel images"
  on hotel_images for select using (true);

create policy "Partners/admins can manage hotel images"
  on hotel_images for all using (
    exists (
      select 1 from hotels h
      where h.id = hotel_id
      and (h.owner_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- ============================================================
-- AMENITIES
-- ============================================================
create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  category text
);

alter table amenities enable row level security;

create policy "Anyone can view amenities"
  on amenities for select using (true);

create policy "Admins can manage amenities"
  on amenities for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- HOTEL AMENITIES
-- ============================================================
create table if not exists hotel_amenities (
  hotel_id uuid references hotels(id) on delete cascade,
  amenity_id uuid references amenities(id) on delete cascade,
  primary key (hotel_id, amenity_id)
);

alter table hotel_amenities enable row level security;

create policy "Anyone can view hotel amenities"
  on hotel_amenities for select using (true);

create policy "Partners/admins can manage hotel amenities"
  on hotel_amenities for all using (
    exists (
      select 1 from hotels h
      where h.id = hotel_id
      and (h.owner_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- ============================================================
-- ROOMS
-- ============================================================
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  description text,
  max_guests int,
  bed_type text,
  size_sqm numeric,
  base_price numeric not null check (base_price >= 0),
  currency text default 'USD',
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table rooms enable row level security;

create policy "Anyone can view active rooms"
  on rooms for select using (is_active = true);

create policy "Partners/admins can manage rooms"
  on rooms for all using (
    exists (
      select 1 from hotels h
      where h.id = hotel_id
      and (h.owner_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- ============================================================
-- ROOM AVAILABILITY
-- ============================================================
create table if not exists room_availability (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  date date not null,
  available_units int default 0,
  price numeric,
  currency text default 'USD',
  unique(room_id, date)
);

alter table room_availability enable row level security;

create policy "Anyone can view room availability"
  on room_availability for select using (true);

create policy "Partners/admins can manage availability"
  on room_availability for all using (
    exists (
      select 1 from rooms r
      join hotels h on h.id = r.hotel_id
      where r.id = room_id
      and (h.owner_id = auth.uid()
           or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

-- ============================================================
-- BOOKINGS
-- ============================================================
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  hotel_id uuid references hotels(id),
  room_id uuid references rooms(id),
  check_in date not null,
  check_out date not null,
  guests int not null check (guests > 0),
  total_price numeric not null check (total_price >= 0),
  currency text default 'USD',
  status text default 'pending_payment' check (status in ('pending_payment', 'confirmed', 'cancelled', 'completed')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  guest_full_name text,
  guest_email text,
  guest_phone text,
  created_at timestamp with time zone default now()
);

alter table bookings enable row level security;

create policy "Users can view their own bookings"
  on bookings for select using (auth.uid() = user_id);

create policy "Users can create bookings"
  on bookings for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own bookings"
  on bookings for update using (auth.uid() = user_id);

create policy "Admins can manage all bookings"
  on bookings for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Partners can view bookings for their hotels"
  on bookings for select using (
    exists (
      select 1 from hotels h
      where h.id = hotel_id and h.owner_id = auth.uid()
    )
  );

-- ============================================================
-- WISHLISTS
-- ============================================================
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  hotel_id uuid references hotels(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, hotel_id)
);

alter table wishlists enable row level security;

create policy "Users can manage their own wishlists"
  on wishlists for all using (auth.uid() = user_id);

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  hotel_id uuid references hotels(id) on delete cascade,
  booking_id uuid references bookings(id),
  rating numeric not null check (rating between 1 and 10),
  comment text,
  created_at timestamp with time zone default now()
);

alter table reviews enable row level security;

create policy "Anyone can view reviews"
  on reviews for select using (true);

create policy "Users can create reviews for their bookings"
  on reviews for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update using (auth.uid() = user_id);

-- ============================================================
-- FLIGHT SEARCHES
-- ============================================================
create table if not exists flight_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  origin text not null,
  destination text not null,
  departure_date date not null,
  return_date date,
  travelers int default 1,
  cabin_class text default 'economy',
  created_at timestamp with time zone default now()
);

alter table flight_searches enable row level security;

create policy "Users can manage their own flight searches"
  on flight_searches for all using (auth.uid() = user_id);

-- ============================================================
-- AI TRIP PLANS
-- ============================================================
create table if not exists ai_trip_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  destination text,
  prompt text,
  itinerary jsonb,
  created_at timestamp with time zone default now()
);

alter table ai_trip_plans enable row level security;

create policy "Users can manage their own trip plans"
  on ai_trip_plans for all using (auth.uid() = user_id);

create policy "Admins can view all trip plans"
  on ai_trip_plans for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
