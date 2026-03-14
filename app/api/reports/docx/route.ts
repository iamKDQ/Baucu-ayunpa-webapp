
import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/db";
import { buildElectionReport } from "@/lib/docx-report";

export async function GET(){
  const data = await getDashboardSummary();
  const buffer = await buildElectionReport(data);

  return new NextResponse(buffer,{
    headers:{
      "Content-Type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":"attachment; filename=bao-cao-bau-cu-ayunpa.docx"
    }
  })
}
