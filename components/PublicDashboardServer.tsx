import { formatNumber, formatPercent } from "@/lib/utils";

type AreaItem = {
  id: string;
  area_number: number;
  election_unit: string;
  area_name: string;
  neighborhoods: string[];
  polling_place: string;
  total_voters: number;
  voted_count: number;
  status: string;
  updated_at: string | null;
};

export function PublicDashboardServer({ areas }: { areas: AreaItem[] }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-stone-200 px-4 py-4 md:px-5">
        <h3 className="font-semibold text-stone-900">Tiến độ theo khu vực bỏ phiếu</h3>
        <p className="mt-1 text-sm text-stone-600">
          Dashboard công khai hiển thị thời gian cập nhật mới nhất của từng khu vực bỏ phiếu.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-stone-50 text-left text-stone-600">
            <tr>
              <th className="px-4 py-3">KVBP</th>
              <th className="px-4 py-3">Đơn vị bầu cử</th>
              <th className="px-4 py-3">Tổ dân phố</th>
              <th className="px-4 py-3">Tổng số cử tri</th>
              <th className="px-4 py-3">Đã bỏ phiếu</th>
              <th className="px-4 py-3">Tỷ lệ</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Cập nhật mới nhất</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((area) => {
              const rate = area.total_voters ? (area.voted_count / area.total_voters) * 100 : 0;
              const statusLabel = area.updated_at ? "Đã cập nhật" : "Chưa cập nhật";

              return (
                <tr key={area.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3 font-semibold">KV {area.area_number}</td>
                  <td className="px-4 py-3">{area.election_unit}</td>
                  <td className="px-4 py-3">{(area.neighborhoods ?? []).join(", ")}</td>
                  <td className="px-4 py-3">{formatNumber(area.total_voters)}</td>
                  <td className="px-4 py-3">{formatNumber(area.voted_count)}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700">{formatPercent(rate)}</td>
                  <td className="px-4 py-3">
                    <span className={area.updated_at ? "status-ok" : "status-waiting"}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {area.updated_at ? new Date(area.updated_at).toLocaleString("vi-VN") : "Chưa có dữ liệu"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
