import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { RoleAssignmentManager } from "@/components/RoleAssignmentManager";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { getPollingAreas, getUsersWithAssignments } from "@/lib/db";

async function isAdminUser(userId: string) {
  const admin = createAdminClient();

  const userRolesRes = await admin
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);

  if (userRolesRes.error) {
    console.error("userRolesRes.error", userRolesRes.error);
    return false;
  }

  const roleIds = (userRolesRes.data ?? [])
    .map((item: any) => item.role_id)
    .filter(Boolean);

  if (roleIds.length === 0) {
    return false;
  }

  const rolesRes = await admin
    .from("roles")
    .select("id, code")
    .in("id", roleIds);

  if (rolesRes.error) {
    console.error("rolesRes.error", rolesRes.error);
    return false;
  }

  const roleCodes = (rolesRes.data ?? [])
    .map((item: any) => item.code)
    .filter(Boolean);

  return roleCodes.includes("super_admin") || roleCodes.includes("ward_admin");
}

export default async function RolesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AdminTopbar user={null} />
            <section className="card p-5">
              <h1 className="text-2xl font-bold text-stone-900">Không có quyền truy cập</h1>
              <p className="mt-2 text-stone-600">
                Bạn cần đăng nhập bằng tài khoản quản trị để vào trang này.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const isAdmin = await isAdminUser(user.id);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AdminTopbar user={user} />

            <section className="card p-5">
              <h1 className="text-2xl font-bold text-stone-900">Không có quyền truy cập</h1>
              <p className="mt-2 text-stone-600">
                Tài khoản của bạn không được phép phân quyền, khóa, mở khóa hoặc xóa người dùng.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const admin = createAdminClient();

  const [users, areas, authUsersResult] = await Promise.all([
    getUsersWithAssignments(),
    getPollingAreas(),
    admin.auth.admin.listUsers()
  ]);

  const authUsers = authUsersResult.data?.users ?? [];

  const mergedUsers = users.map((u: any) => {
    const authUser = authUsers.find((item: any) => item.id === u.id);
    return {
      ...u,
      email: authUser?.email ?? "",
      is_active: authUser?.banned_until ? false : true
    };
  });

  const roleOptions = [
    { code: "ward_admin", name: "Quản trị phường" },
    { code: "area_editor", name: "Nhập liệu theo khu vực" },
    { code: "viewer", name: "Chỉ xem báo cáo" }
  ];

  const areaOptions = areas.map((area) => ({
    id: area.id,
    area_number: area.area_number,
    area_name: area.area_name
  }));

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />

          <section className="card p-5">
            <h1 className="text-2xl font-bold text-stone-900">Phân quyền người dùng</h1>
            <p className="mt-2 text-stone-600">
              Quản trị viên có thể thay đổi vai trò, cập nhật khu vực bỏ phiếu được giao, khóa/mở khóa hoặc xóa người dùng.
            </p>
          </section>

          <RoleAssignmentManager
            users={mergedUsers}
            roles={roleOptions}
            areas={areaOptions}
          />
        </div>
      </div>
    </main>
  );
}