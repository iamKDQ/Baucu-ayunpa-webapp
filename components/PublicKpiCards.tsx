import Link from "next/link";
import { formatNumber, formatPercent } from "@/lib/utils";

type Data = {
  totalWardVoters: number;
  totalAreas: number;
  totalVoted: number;
  turnoutRate: number;
  reportedAreas: number;
  pendingAreas: number;
};

export function PublicKpiCards({ data }: { data: Data }) {
  const items = [
    { label: "Tổng số cử tri toàn phường", value: formatNumber(data.totalWardVoters) },
    { label: "Tổng số khu vực bỏ phiếu", value: formatNumber(data.totalAreas) },
    { label: "Số cử tri đã bỏ phiếu", value: formatNumber(data.totalVoted) },
    { label: "Tỷ lệ toàn phường", value: formatPercent(data.turnoutRate) }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="kpi-card xl:col-span-1">
          <p className="text-sm text-stone-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold text-brand-700">{item.value}</p>
        </div>
      ))}

      <Link href="/missing-reports" className="kpi-card xl:col-span-1 hover:bg-stone-50">
        <p className="text-sm text-stone-500">Đã báo cáo</p>
        <p className="mt-2 text-2xl font-bold text-brand-700">{formatNumber(data.reportedAreas)}</p>
      </Link>

      <Link href="/missing-reports" className="kpi-card xl:col-span-1 hover:bg-stone-50">
        <p className="text-sm text-stone-500">Chưa báo cáo</p>
        <p className="mt-2 text-2xl font-bold text-brand-700">{formatNumber(data.pendingAreas)}</p>
      </Link>
    </div>
  );
}
