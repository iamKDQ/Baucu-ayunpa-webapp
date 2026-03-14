import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { createClient } from "@/lib/supabase-server";
import {
  getCurrentUserRoleCodes,
  getDashboardSummary,
  getLatestProgressRows
} from "@/lib/db";
import ExportDocxButton from "@/components/ExportDocxButton";
import ExportExcelButton from "@/components/ExportExcelButton";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const roleCodes = await getCurrentUserRoleCodes();
  const canExport =
    roleCodes.includes("super_admin") ||
    roleCodes.includes("ward_admin") ||
    roleCodes.includes("viewer");

  const [summary, rows] = await Promise.all([
    getDashboardSummary(),
    getLatestProgressRows()
  ]);

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />

          <section className="card p-5">
            <h1 className="text-2xl font-bold text-stone-900">Báo cáo</h1>
            <p className="mt-2 text-stone-600">
              Xem tổng hợp tiến độ và xuất báo cáo Word, Excel.
            </p>

            {canExport ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <ExportExcelButton rows={rows} />
                <ExportDocxButton rows={rows} summary={summary} />
              </div>
            ) : null}
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">
              Tóm tắt toàn phường
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="text-sm text-stone-500">Tổng số cử tri</div>
                <div className="mt-2 text-2xl font-bold text-stone-900">
                  {summary.totalWardVoters.toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="text-sm text-stone-500">Đã bỏ phiếu</div>
                <div className="mt-2 text-2xl font-bold text-stone-900">
                  {summary.totalVoted.toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="text-sm text-stone-500">Tỷ lệ</div>
                <div className="mt-2 text-2xl font-bold text-stone-900">
                  {summary.turnoutRate}%
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <div className="text-sm text-stone-500">Đã báo cáo</div>
                <div className="mt-2 text-2xl font-bold text-stone-900">
                  {summary.reportedAreas}/{summary.totalAreas}
                </div>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">
              Dữ liệu báo cáo gần nhất
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">ID báo cáo</th>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Giờ</th>
                    <th className="px-4 py-3">Đã bỏ phiếu</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any) => (
                    <tr key={row.id} className="border-t border-stone-100">
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="px-4 py-3">{row.polling_area_id}</td>
                      <td className="px-4 py-3">{row.report_date}</td>
                      <td className="px-4 py-3">{row.report_hour}</td>
                      <td className="px-4 py-3">{row.voted_count}</td>
                      <td className="px-4 py-3">{row.status}</td>
                    </tr>
                  ))}

                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-stone-500">
                        Chưa có dữ liệu báo cáo.
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
