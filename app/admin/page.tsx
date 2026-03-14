import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { KpiCards } from "@/components/KpiCards";
import { AdminResetPanel } from "@/components/AdminResetPanel";
import { getCurrentUserRoleCodes, getDashboardSummary } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [summary, roles] = await Promise.all([getDashboardSummary(), getCurrentUserRoleCodes()]);
  const isAdmin = roles.includes("super_admin") || roles.includes("ward_admin");

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />
          <KpiCards data={summary} />

          {isAdmin ? (
            <section className="grid gap-6 xl:grid-cols-2">
              <div className="card p-5">
                <h2 className="text-lg font-bold text-stone-900">Dữ liệu nền ban đầu</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
                    <span>Tổng số cử tri toàn phường</span>
                    <strong>{summary.totalWardVoters}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-stone-50 px-4 py-3">
                    <span>Số khu vực bỏ phiếu cố định</span>
                    <strong>11 khu vực</strong>
                  </div>
                  <div className="rounded-xl border border-dashed border-stone-300 p-4 text-stone-600">
                    Quản trị viên có thể cập nhật dữ liệu nền, tạo tài khoản và phân quyền theo khu vực bỏ phiếu.
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="text-lg font-bold text-stone-900">Phân quyền người dùng</h2>
                <div className="mt-4 space-y-3 text-sm text-stone-600">
                  <p>- Super Admin</p>
                  <p>- Quản trị phường</p>
                  <p>- Nhập liệu khu vực bỏ phiếu</p>
                  <p>- Chỉ xem báo cáo</p>
                  <div className="rounded-xl border border-dashed border-stone-300 p-4">
                    Người nhập liệu chỉ được nhập dữ liệu cho khu vực đã được gán.
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="card p-5">
              <h2 className="text-lg font-bold text-stone-900">Khu vực làm việc</h2>
              <p className="mt-2 text-stone-600">
                Tài khoản của bạn không phải admin. Bạn chỉ cần dùng các chức năng được phân quyền như nhập tiến độ hoặc xem báo cáo.
              </p>
            </section>
          )}
          {isAdmin ? <AdminResetPanel /> : null}
        </div>
      </div>
    </main>
  );
}
