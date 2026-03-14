import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { ProgressEntryServerForm } from "@/components/ProgressEntryServerForm";
import { createClient } from "@/lib/supabase-server";
import { getLatestProgressRows, getPollingAreas, getScopedAreasForCurrentUser } from "@/lib/db";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [areas, reports, allAreas] = await Promise.all([
    getScopedAreasForCurrentUser(),
    getLatestProgressRows(),
    getPollingAreas()
  ]);

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />

          {areas.length > 0 ? (
            <ProgressEntryServerForm areas={areas} />
          ) : (
            <section className="card p-5">
              <h2 className="text-lg font-bold text-stone-900">Nhập tiến độ theo khu vực bỏ phiếu</h2>
              <p className="mt-2 text-stone-600">
                Tài khoản này chưa được admin phân quyền cho khu vực bỏ phiếu nào, nên chưa thể nhập dữ liệu.
              </p>
            </section>
          )}

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">Lịch sử báo cáo gần đây</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Giờ</th>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Đã bỏ phiếu</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.slice(0, 20).map((item: any) => {
                    const area = allAreas.find((a) => a.id === item.polling_area_id);
                    return (
                      <tr key={item.id} className="border-t border-stone-100">
                        <td className="px-4 py-3">{item.report_date}</td>
                        <td className="px-4 py-3">{item.report_hour}h</td>
                        <td className="px-4 py-3">{area ? `KV ${area.area_number} - ${area.area_name}` : item.polling_area_id}</td>
                        <td className="px-4 py-3">{item.voted_count}</td>
                        <td className="px-4 py-3">{item.status}</td>
                        <td className="px-4 py-3">{new Date(item.updated_at).toLocaleString("vi-VN")}</td>
                      </tr>
                    );
                  })}
                  {reports.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-stone-500" colSpan={6}>
                        Chưa có báo cáo nào trong cơ sở dữ liệu.
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
