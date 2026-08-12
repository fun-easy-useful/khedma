create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references auth.users(id) on delete cascade,
  image_path text not null,
  image_url text,
  vehicle_type text not null,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'MAD',
  details text,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.vehicles enable row level security;
create policy "Anyone can view available vehicles" on public.vehicles for select using (available = true or auth.uid() = provider_id);
create policy "Providers can create own vehicles" on public.vehicles for insert with check (auth.uid() = provider_id);
create policy "Providers can update own vehicles" on public.vehicles for update using (auth.uid() = provider_id) with check (auth.uid() = provider_id);
create policy "Providers can delete own vehicles" on public.vehicles for delete using (auth.uid() = provider_id);

insert into storage.buckets (id,name,public) values ('vehicle-images','vehicle-images',true) on conflict (id) do nothing;
create policy "Public can view vehicle images" on storage.objects for select using (bucket_id = 'vehicle-images');
create policy "Authenticated users upload vehicle images" on storage.objects for insert to authenticated with check (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Owners update vehicle images" on storage.objects for update to authenticated using (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Owners delete vehicle images" on storage.objects for delete to authenticated using (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
