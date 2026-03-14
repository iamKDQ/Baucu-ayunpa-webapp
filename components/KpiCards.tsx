import { KpiSummary } from "@/types";
import { formatNumber, formatPercent } from "@/lib/utils";

export function KpiCards({ data }: { data: KpiSummary }) {
  const items = [
    { label: "Tổng số cử tri toàn phường", value: formatNumber(data.totalWardVoters) },
    { label: "Tổng số khu vực bỏ phiếu", value: formatNumber(data.totalAreas) },
    { label: "Số cử tri đã bỏ phiếu", value: formatNumber(data.totalVoted) },
    { label: "Tỷ lệ toàn phường", value: formatPercent(data.turnoutRate) },
    { label: "Đã báo cáo", value: formatNumber(data.reportedAreas) },
    { label: "Chưa báo cáo", value: formatNumber(data.pendingAreas) }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="kpi-card">
          <p className="text-sm text-stone-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-brand-700">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
