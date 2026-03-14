"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { REPORT_TIME_OPTIONS } from "@/lib/report-utils";

type OverviewItem = {
  time: number | "current";
  label: string;
  totalVoted: number;
  turnoutRate: number;
  reportedAreas: number;
  missingAreas: number;
};

type SummaryRow = {
  id: string;
  area_number: number;
  area_name: string;
  election_unit: string;
  polling_place: string;
  neighborhoods: string[];
  total_voters: number;
  voted_count: number;
  rate: number;
  updated_at: string | null;
};

export function HourlyProgressDashboard({
  mode = "public"
}: {
  mode?: "public" | "admin";
}) {
  const [selectedTime, setSelectedTime] = useState("current");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewItem[]>([]);
  const [rows, setRows] = useState<SummaryRow[]>([]);
  const [missingRows, setMissingRows] = useState<SummaryRow[]>([]);
  const [selectedLabel, setSelectedLabel] = useState("Hiện tại");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(`/api/hourly-summary?time=${selectedTime}`);
        const data = await res.json();

        setOverview(data.overview ?? []);
        setRows(data.summary?.rows ?? []);
        setMissingRows(data.summary?.missingAreas ?? []);
        setSelectedLabel(data.summary?.selectedLabel ?? "Hiện tại");
      } catch (error) {
        console.error("load hourly summary failed:", error);
        setOverview([]);
        setRows([]);
        setMissingRows([]);
        setSelectedLabel("Hiện tại");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedTime]);

  const chartData = useMemo(
    () =>
      overview.map((item) => ({
        label: item.label,
        totalVoted: item.totalVoted,
        turnoutRate: item.turnoutRate,
        reportedAreas: item.reportedAreas,
        missingAreas: item.missingAreas
      })),
    [overview]
  );

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Thống kê tiến độ theo thời gian
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Mặc định hiển thị dữ liệu đến thời điểm hiện tại thực tế. Bạn vẫn có thể chọn nhanh các mốc quy định.
            </p>
            <p className="mt-2 text-sm font-medium text-brand-700">
              Mốc đang xem: {selectedLabel}
            </p>
          </div>

          <div className="w-full md:w-[260px]">
            <label className="label">Chọn thời điểm hiển thị</label>
            <select
              className="input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {REPORT_TIME_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <h3 className="text-lg font-bold text-stone-900">
            Số cử tri đã bỏ phiếu theo mốc thời gian
          </h3>
          <div className="mt-4 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalVoted"
                  name="Đã bỏ phiếu"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="text-lg font-bold text-stone-900">
            Tỷ lệ cử tri đi bầu theo mốc thời gian
          </h3>
          <div className="mt-4 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="turnoutRate"
                  name="Tỷ lệ"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {mode === "admin" && (
        <section className="card p-5">
          <h3 className="text-lg font-bold text-stone-900">
            Bảng khu vực chưa báo cáo
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Dữ liệu được tính theo thời điểm đang chọn ở phía trên.
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
                {missingRows.map((area) => (
                  <tr key={area.id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium">
                      KV {area.area_number} - {area.area_name}
                    </td>
                    <td className="px-4 py-3">{area.election_unit || "-"}</td>
                    <td className="px-4 py-3">
                      {(area.neighborhoods ?? []).length > 0
                        ? (area.neighborhoods ?? []).join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">{area.polling_place || "-"}</td>
                  </tr>
                ))}

                {!loading && missingRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-stone-500">
                      Tất cả khu vực đã báo cáo ở thời điểm này.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-stone-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {mode === "admin" && (
        <section className="card p-5">
          <h3 className="text-lg font-bold text-stone-900">
            Tóm tắt theo khu vực tại thời điểm đang chọn
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-stone-50 text-left text-stone-600">
                <tr>
                  <th className="px-4 py-3">Khu vực</th>
                  <th className="px-4 py-3">Tổng cử tri</th>
                  <th className="px-4 py-3">Đã bỏ phiếu</th>
                  <th className="px-4 py-3">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((area) => (
                  <tr key={area.id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium">
                      KV {area.area_number} - {area.area_name}
                    </td>
                    <td className="px-4 py-3">{area.total_voters}</td>
                    <td className="px-4 py-3">{area.voted_count}</td>
                    <td className="px-4 py-3">{area.rate}%</td>
                  </tr>
                ))}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-stone-500">
                      Chưa có dữ liệu để hiển thị.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}