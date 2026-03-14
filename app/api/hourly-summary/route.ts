import { NextRequest, NextResponse } from "next/server";
import { getProgressSummaryByHour, getHourlyOverview } from "@/lib/db";

export async function GET(request: NextRequest) {
  const selected = request.nextUrl.searchParams.get("time");

  let selectedHour: number | "current" = "current";
  if (selected && selected !== "current") {
    selectedHour = Number(selected);
  }

  const [summary, overview] = await Promise.all([
    getProgressSummaryByHour(selectedHour),
    getHourlyOverview()
  ]);

  return NextResponse.json({
    selectedTime: selectedHour,
    summary,
    overview
  });
}