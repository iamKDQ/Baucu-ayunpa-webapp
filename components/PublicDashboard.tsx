"use client";

import { pollingAreas, hourlyProgress, kpiSummary } from "@/lib/mock-data";
import { formatNumber, formatPercent } from "@/lib/utils";
import { PollingArea } from "@/types";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function PublicDashboard() {
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState<number>(pollingAreas[0].id);

  const filteredAreas = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return pollingAreas;
    return pollingAreas.filter((item) => {
      const text = [
        item.unitName,
        item.areaName,
        item.pollingPlace,
        item.neighborhoods.join(" "),
        `khu vực ${item.areaNumber}`
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [keyword]);

  const selectedArea: PollingArea =
    filteredAreas.find((item) => item.id === selectedId) ?? filteredAreas[0] ?? pollingAreas[0];

  return (
    <div className="space-y-6">
      <section className="card p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Tra cứu tiến độ cử tri đi bỏ phiếu
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Dữ liệu tổng hợp theo 11 khu vực bỏ phiếu của Phường Ayun Pa.
            </p>
          </div>
          <div className="w-full md:max-w-sm">
            <label className="label">Tìm theo khu vực / tổ dân phố / địa điểm</label>
            <input
              className="input"
              placeholder="Nhập khu vực, TDP, địa điểm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-stone-200 px-4 py-4 md:px-5">
            <h3 className="font-semibold text-stone-900">Tiến độ theo khu vực bỏ phiếu</h3>
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
                </tr>
              </thead>
              <tbody>
                {filteredAreas.map((area) => {
                  const turnoutRate = (area.votedCount / area.totalVoters) * 100;
                  const active = selectedArea.id === area.id;
                  return (
                    <tr
                      key={area.id}
                      onClick={() => setSelectedId(area.id)}
                      className={`cursor-pointer border-t border-stone-100 ${
                        active ? "bg-orange-50" : "hover:bg-stone-50"
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-stone-900">
                        KV {area.areaNumber}
                      </td>
                      <td className="px-4 py-3">{area.unitName}</td>
                      <td className="px-4 py-3">{area.neighborhoods.join(", ")}</td>
                      <td className="px-4 py-3">{formatNumber(area.totalVoters)}</td>
                      <td className="px-4 py-3">{formatNumber(area.votedCount)}</td>
                      <td className="px-4 py-3 font-semibold text-brand-700">
                        {formatPercent(turnoutRate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={area.status === "OK" ? "status-ok" : "status-waiting"}>
                          {area.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-4 md:p-5">
            <h3 className="mb-4 font-semibold text-stone-900">Tiến độ toàn phường theo giờ</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votedCount" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card p-4 md:p-5">
            <h3 className="font-semibold text-stone-900">Chi tiết khu vực</h3>
            <div className="mt-4 space-y-3 text-sm">
              <InfoRow label="Tên khu vực" value={selectedArea.areaName} />
              <InfoRow label="Đơn vị bầu cử" value={selectedArea.unitName} />
              <InfoRow
                label="Tổ dân phố"
                value={selectedArea.neighborhoods.join(", ")}
              />
              <InfoRow label="Địa điểm bỏ phiếu" value={selectedArea.pollingPlace} />
              <InfoRow
                label="Tổng số cử tri"
                value={formatNumber(selectedArea.totalVoters)}
              />
              <InfoRow
                label="Số cử tri đã bỏ phiếu"
                value={formatNumber(selectedArea.votedCount)}
              />
              <InfoRow label="Cập nhật lúc" value={selectedArea.updatedAt} />
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="sr-only">
          {JSON.stringify(kpiSummary)}
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 border-b border-stone-100 pb-3">
      <span className="font-medium text-stone-500">{label}</span>
      <span className="text-stone-900">{value}</span>
    </div>
  );
}
