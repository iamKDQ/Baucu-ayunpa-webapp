import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { createClient } from "@/lib/supabase-server";
import { getCurrentUserRoleCodes, getDashboardSummary, getLatestProgressRows } from "@/lib/db";
import ExportDocxButton from "@/components/ExportDocxButton";
import ExportExcelButton from "@/components/ExportExcelButton";
import { HourlyProgressDashboard } from "@/components/HourlyProgressDashboard";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [summary, reports, roles] = await Promise.all([
    getDashboardSummary(),
    getLatestProgressRows(),
    getCurrentUserRoleCodes()
  ]);
  const canExport = roles.includes("super_admin") || roles.includes("ward_admin") || roles.includes("viewer");

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />
          <section className="card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">Báo cáo</h1>
                <p className="mt-2 text-stone-600">
                  Người được phân quyền xem báo cáo có thể tổng hợp và xuất báo cáo.
                </p>
              </div>
              {canExport ? (
                <div className="flex gap-3">
                  <ExportExcelButton />
                  <ExportDocxButton />
                </div>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Tổng số cử tri</p>
                <p className="mt-2 text-2xl font-bold text-brand-700">{summary.totalWardVoters}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Đã bỏ phiếu</p>
                <p className="mt-2 text-2xl font-bold text-brand-700">{summary.totalVoted}</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Tỷ lệ</p>
                <p className="mt-2 text-2xl font-bold text-brand-700">{summary.turnoutRate}%</p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Số báo cáo đã nhập</p>
                <p className="mt-2 text-2xl font-bold text-brand-700">{reports.length}</p>
              </div>
            </div>
          </section>
<HourlyProgressDashboard mode="admin" />
          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">Chi tiết 11 khu vực</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Tổ dân phố</th>
                    <th className="px-4 py-3">Tổng cử tri</th>
                    <th className="px-4 py-3">Đã bỏ phiếu</th>
                    <th className="px-4 py-3">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.areas.map((area) => {
                    const rate = area.total_voters ? ((area.voted_count / area.total_voters) * 100).toFixed(2) : "0.00";
                    return (
                      <tr key={area.id} className="border-t border-stone-100">
                        <td className="px-4 py-3 font-medium">KV {area.area_number} - {area.area_name}</td>
                        <td className="px-4 py-3">{area.neighborhoods.join(", ")}</td>
                        <td className="px-4 py-3">{area.total_voters}</td>
                        <td className="px-4 py-3">{area.voted_count}</td>
                        <td className="px-4 py-3">{rate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
