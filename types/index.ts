export type PollingArea = {
  id: number;
  areaNumber: number;
  unitName: string;
  areaName: string;
  wardName: string;
  neighborhoods: string[];
  pollingPlace: string;
  totalVoters: number;
  votedCount: number;
  updatedAt: string;
  status: "OK" | "Chưa báo cáo";
};

export type HourlyProgress = {
  hour: string;
  votedCount: number;
};

export type KpiSummary = {
  totalWardVoters: number;
  totalAreas: number;
  totalVoted: number;
  turnoutRate: number;
  reportedAreas: number;
  pendingAreas: number;
};
