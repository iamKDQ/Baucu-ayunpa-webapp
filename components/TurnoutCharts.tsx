"use client";

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

type AreaItem = {
  id: string;
  area_number: number;
  area_name: string;
  total_voters: number;
  voted_count: number;
};

export function TurnoutCharts({ areas }: { areas: AreaItem[] }) {
  const areaChartData = areas.map((area) => ({
    name: `KV ${area.area_number}`,
    totalVoters: area.total_voters,
    votedCount: area.voted_count,
    turnoutRate:
      area.total_voters > 0
        ? Number(((area.voted_count / area.total_voters) * 100).toFixed(2))
        : 0
  }));

  const cumulativeData = buildCumulativeData(areas);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="card p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-900">
            So sánh tổng cử tri và số đã bỏ phiếu theo khu vực
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Biểu đồ cột giúp theo dõi khu vực nào đã cập nhật mạnh, khu vực nào còn thấp.
          </p>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalVoters" name="Tổng cử tri" fill="#93c5fd" radius={[8, 8, 0, 0]} />
              <Bar dataKey="votedCount" name="Đã bỏ phiếu" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-900">
            Tỷ lệ cử tri đi bầu theo tiến độ tích lũy
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            Biểu đồ đường mô phỏng phong cách dashboard trực quan như ảnh tham khảo.
          </p>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="turnoutRate"
                name="Tỷ lệ tích lũy"
                stroke="#3b82f6"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function buildCumulativeData(areas: AreaItem[]) {
  const totalVoters = areas.reduce((sum, item) => sum + item.total_voters, 0);
  let runningVoted = 0;

  return [...areas]
    .sort((a, b) => a.area_number - b.area_number)
    .map((area) => {
      runningVoted += area.voted_count;
      return {
        label: `KV ${area.area_number}`,
        turnoutRate:
          totalVoters > 0 ? Number(((runningVoted / totalVoters) * 100).toFixed(2)) : 0
      };
    });
}
