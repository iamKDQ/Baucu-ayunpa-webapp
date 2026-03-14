export const REPORT_TIME_OPTIONS = [
  { value: "current", label: "Đến thời điểm hiện tại" },
  { value: "8", label: "8h" },
  { value: "10.5", label: "10h30" },
  { value: "12", label: "12h" },
  { value: "14", label: "14h" },
  { value: "16", label: "16h" },
  { value: "18", label: "18h" },
  { value: "20", label: "20h" },
  { value: "21", label: "21h" }
];

export function normalizeReportHour(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (value === "current") return "current";
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getCurrentRealHour() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const decimal = hour + minute / 60;

  if (decimal < 5) return 5;
  if (decimal > 22) return 22;

  return Number(decimal.toFixed(2));
}

export function formatHourLabel(value: number | "current") {
  if (value === "current") return "Hiện tại";

  const whole = Math.floor(value);
  const minutes = Math.round((value - whole) * 60);

  if (minutes === 0) return `${whole}h`;
  return `${whole}h${String(minutes).padStart(2, "0")}`;
}