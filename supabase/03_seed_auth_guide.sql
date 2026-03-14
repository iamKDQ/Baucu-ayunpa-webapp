-- Tạo user trong Supabase Authentication trước, ví dụ admin@ayunpa.local
insert into public.profiles (id, full_name, phone)
values ('66896105-23dd-4914-9ae7-1aea6a88c7b0', 'Quản trị hệ thống Ayun Pa', '0900000000')
on conflict (id) do update set full_name = excluded.full_name, phone = excluded.phone;

insert into public.user_roles (user_id, role_id)
select '66896105-23dd-4914-9ae7-1aea6a88c7b0', r.id
from public.roles r
where r.code = 'ward_admin'
on conflict do nothing;

insert into public.area_assignments (user_id, polling_area_id, can_edit)
select '66896105-23dd-4914-9ae7-1aea6a88c7b0', pa.id, true
from public.polling_areas pa
where pa.area_number = 1
on conflict do nothing;
