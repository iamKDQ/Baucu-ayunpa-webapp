import { getMissingReportsByMilestone } from "@/lib/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function MissingReportsPage() {
  const milestones = await getMissingReportsByMilestone();

  return (
    <main>
      <Header />
      <div className="container-page space-y-6">
        <div>
          <h2 className="page-title">Thống kê khu vực chưa báo cáo theo mốc thời gian</h2>
          <p className="page-subtitle">
            Các mốc quy định gồm: 8h, 10h30, 14h, 18h, 21h.
          </p>
        </div>

        <div className="grid gap-6">
          {milestones.map((milestone) => (
            <section key={milestone.label} className="card p-5">
              <h3 className="text-lg font-bold text-stone-900">Mốc {milestone.label}</h3>
              <p className="mt-2 text-sm text-stone-600">
                Số khu vực chưa báo cáo: {milestone.missingAreas.length}
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-stone-50 text-left text-stone-600">
                    <tr>
                      <th className="px-4 py-3">Khu vực</th>
                      <th className="px-4 py-3">Đơn vị bầu cử</th>
                      <th className="px-4 py-3">Tổ dân phố</th>
                      <th className="px-4 py-3">Địa điểm bỏ phiếu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milestone.missingAreas.map((area) => (
                      <tr key={area.id} className="border-t border-stone-100">
                        <td className="px-4 py-3 font-medium">KV {area.area_number} - {area.area_name}</td>
                        <td className="px-4 py-3">{area.election_unit}</td>
                        <td className="px-4 py-3">{area.neighborhoods.join(", ")}</td>
                        <td className="px-4 py-3">{area.polling_place}</td>
                      </tr>
                    ))}
                    {milestone.missingAreas.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-stone-500" colSpan={4}>
                          Tất cả khu vực đã báo cáo ở mốc này.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
