-- Bầu cử ĐBQH và HĐND các cấp - Phường Ayun Pa
create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  unique(user_id, role_id)
);

create table if not exists public.polling_areas (
  id uuid primary key default gen_random_uuid(),
  area_number integer not null unique check (area_number between 1 and 11),
  election_unit text not null,
  area_name text not null,
  ward_name text not null default 'Phường Ayun Pa',
  neighborhoods text[] not null default '{}',
  polling_place text not null,
  total_voters integer not null default 0 check (total_voters >= 0),
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.area_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  polling_area_id uuid not null references public.polling_areas(id) on delete cascade,
  can_edit boolean not null default true,
  unique(user_id, polling_area_id)
);

create table if not exists public.progress_reports (
  id uuid primary key default gen_random_uuid(),
  polling_area_id uuid not null references public.polling_areas(id) on delete cascade,
  report_date date not null default current_date,
  report_hour integer not null check (report_hour between 5 and 22),
  voted_count integer not null check (voted_count >= 0),
  note text,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'approved')),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(polling_area_id, report_date, report_hour)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_name text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists trg_polling_areas_updated_at on public.polling_areas;
create trigger trg_polling_areas_updated_at before update on public.polling_areas for each row execute function public.set_updated_at();
drop trigger if exists trg_progress_reports_updated_at on public.progress_reports;
create trigger trg_progress_reports_updated_at before update on public.progress_reports for each row execute function public.set_updated_at();

insert into public.roles (code, name, description) values
  ('super_admin', 'Super Admin', 'Toàn quyền hệ thống'),
  ('ward_admin', 'Quản trị phường', 'Quản lý dữ liệu toàn phường'),
  ('area_editor', 'Nhập liệu khu vực', 'Nhập và cập nhật số liệu khu vực được giao'),
  ('viewer', 'Chỉ xem báo cáo', 'Chỉ xem dashboard và báo cáo')
on conflict (code) do nothing;

insert into polling_areas (area_number, area_name, polling_place, total_voters) values
(1,'Khu vực bỏ phiếu số 1','Nhà sinh hoạt cộng đồng TDP 2',2810),
(2,'Khu vực bỏ phiếu số 2','Nhà sinh hoạt cộng đồng TDP 6',1350),
(3,'Khu vực bỏ phiếu số 3','Nhà sinh hoạt cộng đồng TDP 7',1391),
(4,'Khu vực bỏ phiếu số 4','Nhà sinh hoạt cộng đồng TDP 10',1515),
(5,'Khu vực bỏ phiếu số 5','Nhà sinh hoạt cộng đồng TDP 13',1521),
(6,'Khu vực bỏ phiếu số 6','Nhà sinh hoạt cộng đồng TDP 16',2489),
(7,'Khu vực bỏ phiếu số 7','Nhà sinh hoạt cộng đồng TDP 20',2224),
(8,'Khu vực bỏ phiếu số 8','Nhà sinh hoạt cộng đồng TDP 23',1521),
(9,'Khu vực bỏ phiếu số 9','Nhà sinh hoạt cộng đồng TDP 24',898),
(10,'Khu vực bỏ phiếu số 10','Nhà sinh hoạt cộng đồng TDP 26',1561),
(11,'Khu vực bỏ phiếu số 11','Nhà sinh hoạt cộng đồng TDP 27',837);
on conflict (area_number) do nothing;
