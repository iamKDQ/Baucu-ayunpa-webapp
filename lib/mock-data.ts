import { HourlyProgress, KpiSummary, PollingArea } from "@/types";

export const pollingAreas: PollingArea[] = [
  {
    id: 1,
    areaNumber: 1,
    unitName: "Đơn vị bầu cử số 1",
    areaName: "Khu vực bỏ phiếu số 1",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 1", "TDP 2", "TDP 3", "TDP 4"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 2",
    totalVoters: 296,
    votedCount: 196,
    updatedAt: "08/03/2026 12:12",
    status: "OK"
  },
  {
    id: 2,
    areaNumber: 2,
    unitName: "Đơn vị bầu cử số 2",
    areaName: "Khu vực bỏ phiếu số 2",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 5", "TDP 6"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 6",
    totalVoters: 286,
    votedCount: 179,
    updatedAt: "08/03/2026 12:14",
    status: "OK"
  },
  {
    id: 3,
    areaNumber: 3,
    unitName: "Đơn vị bầu cử số 2",
    areaName: "Khu vực bỏ phiếu số 3",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 7", "TDP 8"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 7",
    totalVoters: 322,
    votedCount: 201,
    updatedAt: "08/03/2026 12:19",
    status: "OK"
  },
  {
    id: 4,
    areaNumber: 4,
    unitName: "Đơn vị bầu cử số 3",
    areaName: "Khu vực bỏ phiếu số 4",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 9", "TDP 10", "TDP 11"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 10",
    totalVoters: 287,
    votedCount: 178,
    updatedAt: "08/03/2026 12:09",
    status: "OK"
  },
  {
    id: 5,
    areaNumber: 5,
    unitName: "Đơn vị bầu cử số 3",
    areaName: "Khu vực bỏ phiếu số 5",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 12", "TDP 13"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 13",
    totalVoters: 283,
    votedCount: 170,
    updatedAt: "08/03/2026 12:13",
    status: "OK"
  },
  {
    id: 6,
    areaNumber: 6,
    unitName: "Đơn vị bầu cử số 4",
    areaName: "Khu vực bỏ phiếu số 6",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 14", "TDP 15", "TDP 16", "TDP 17"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 16",
    totalVoters: 365,
    votedCount: 231,
    updatedAt: "08/03/2026 12:16",
    status: "OK"
  },
  {
    id: 7,
    areaNumber: 7,
    unitName: "Đơn vị bầu cử số 5",
    areaName: "Khu vực bỏ phiếu số 7",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 18", "TDP 19", "TDP 20", "TDP 21"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 20",
    totalVoters: 222,
    votedCount: 145,
    updatedAt: "08/03/2026 12:22",
    status: "OK"
  },
  {
    id: 8,
    areaNumber: 8,
    unitName: "Đơn vị bầu cử số 6",
    areaName: "Khu vực bỏ phiếu số 8",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 22", "TDP 23"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 23",
    totalVoters: 242,
    votedCount: 133,
    updatedAt: "08/03/2026 12:10",
    status: "OK"
  },
  {
    id: 9,
    areaNumber: 9,
    unitName: "Đơn vị bầu cử số 6",
    areaName: "Khu vực bỏ phiếu số 9",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 24"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 24",
    totalVoters: 188,
    votedCount: 94,
    updatedAt: "08/03/2026 12:08",
    status: "OK"
  },
  {
    id: 10,
    areaNumber: 10,
    unitName: "Đơn vị bầu cử số 7",
    areaName: "Khu vực bỏ phiếu số 10",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 25", "TDP 26"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 26",
    totalVoters: 260,
    votedCount: 149,
    updatedAt: "08/03/2026 12:15",
    status: "OK"
  },
  {
    id: 11,
    areaNumber: 11,
    unitName: "Đơn vị bầu cử số 7",
    areaName: "Khu vực bỏ phiếu số 11",
    wardName: "Phường Ayun Pa",
    neighborhoods: ["TDP 27"],
    pollingPlace: "Nhà sinh hoạt cộng đồng tổ dân phố 27",
    totalVoters: 178,
    votedCount: 82,
    updatedAt: "08/03/2026 12:11",
    status: "OK"
  }
];

export const hourlyProgress: HourlyProgress[] = [
  { hour: "8h", votedCount: 220 },
  { hour: "9h", votedCount: 470 },
  { hour: "10h", votedCount: 760 },
  { hour: "11h", votedCount: 990 },
  { hour: "12h", votedCount: 1230 },
  { hour: "13h", votedCount: 1450 },
  { hour: "14h", votedCount: 1710 },
  { hour: "15h", votedCount: 1940 },
  { hour: "16h", votedCount: 2230 },
  { hour: "17h", votedCount: 2450 }
];

export const kpiSummary: KpiSummary = (() => {
  const totalWardVoters = pollingAreas.reduce((sum, item) => sum + item.totalVoters, 0);
  const totalVoted = pollingAreas.reduce((sum, item) => sum + item.votedCount, 0);
  const reportedAreas = pollingAreas.filter((item) => item.status === "OK").length;
  const pendingAreas = pollingAreas.length - reportedAreas;
  return {
    totalWardVoters,
    totalAreas: pollingAreas.length,
    totalVoted,
    turnoutRate: Number(((totalVoted / totalWardVoters) * 100).toFixed(2)),
    reportedAreas,
    pendingAreas
  };
})();
