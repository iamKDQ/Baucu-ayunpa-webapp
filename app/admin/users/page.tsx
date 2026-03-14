import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { CreateManagedUserForm } from "@/components/CreateManagedUserForm";
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

export default async function UsersPage() {
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
                Tài khoản của bạn không được phép quản lý người dùng.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const [users, areas] = await Promise.all([
    getUsersWithAssignments(),
    getPollingAreas()
  ]);

  const areaOptions = areas.map((item) => ({
    id: item.id,
    area_number: item.area_number,
    area_name: item.area_name
  }));

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />
          <CreateManagedUserForm areas={areaOptions} />

          <section className="card p-5">
            <h1 className="text-2xl font-bold text-stone-900">
              Người dùng và phạm vi được giao
            </h1>
            <p className="mt-2 text-stone-600">
              Chỉ quản trị viên mới được tạo tài khoản và quản lý phạm vi phân quyền của người dùng.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">Họ tên</th>
                    <th className="px-4 py-3">Điện thoại</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3">Khu vực được phân quyền</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-t border-stone-100">
                      <td className="px-4 py-3 font-medium">{u.full_name || "-"}</td>
                      <td className="px-4 py-3">{u.phone || "-"}</td>
                      <td className="px-4 py-3">{u.roles.join(", ") || "-"}</td>
                      <td className="px-4 py-3">
                        {u.assignedAreas.join(", ") || "Toàn phường / chưa gán"}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-stone-500">
                        Chưa có người dùng nào trong bảng profiles.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}