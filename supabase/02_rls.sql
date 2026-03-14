alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.polling_areas enable row level security;
alter table public.area_assignments enable row level security;
alter table public.progress_reports enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.has_role(check_code text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and r.code = check_code
  );
$$;

create or replace function public.can_access_area(target_area_id uuid)
returns boolean
language sql
stable
as $$
  select public.has_role('super_admin')
    or public.has_role('ward_admin')
    or exists (
      select 1 from public.area_assignments aa
      where aa.user_id = auth.uid() and aa.polling_area_id = target_area_id
    );
$$;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin" on public.profiles for select using (
  id = auth.uid() or public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin" on public.profiles for update using (
  id = auth.uid() or public.has_role('super_admin') or public.has_role('ward_admin')
) with check (
  id = auth.uid() or public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "roles_admin_select" on public.roles;
create policy "roles_admin_select" on public.roles for select using (
  public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "user_roles_admin_all" on public.user_roles;
create policy "user_roles_admin_all" on public.user_roles for all using (
  public.has_role('super_admin') or public.has_role('ward_admin')
) with check (
  public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "polling_areas_public_read" on public.polling_areas;
create policy "polling_areas_public_read" on public.polling_areas for select using (true);

drop policy if exists "polling_areas_admin_write" on public.polling_areas;
create policy "polling_areas_admin_write" on public.polling_areas for all using (
  public.has_role('super_admin') or public.has_role('ward_admin')
) with check (
  public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "area_assignments_admin_all" on public.area_assignments;
create policy "area_assignments_admin_all" on public.area_assignments for all using (
  public.has_role('super_admin') or public.has_role('ward_admin')
) with check (
  public.has_role('super_admin') or public.has_role('ward_admin')
);

drop policy if exists "progress_reports_read_by_scope" on public.progress_reports;
create policy "progress_reports_read_by_scope" on public.progress_reports for select using (
  public.can_access_area(polling_area_id)
);

drop policy if exists "progress_reports_insert_by_scope" on public.progress_reports;
create policy "progress_reports_insert_by_scope" on public.progress_reports for insert with check (
  public.can_access_area(polling_area_id)
);

drop policy if exists "progress_reports_update_by_scope" on public.progress_reports;
create policy "progress_reports_update_by_scope" on public.progress_reports for update using (
  public.can_access_area(polling_area_id)
) with check (
  public.can_access_area(polling_area_id)
);

drop policy if exists "audit_logs_admin_read" on public.audit_logs;
create policy "audit_logs_admin_read" on public.audit_logs for select using (
  public.has_role('super_admin') or public.has_role('ward_admin')
);
