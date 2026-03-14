import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase-server";
import { AuthButtons } from "@/components/AuthButtons";
import { getDashboardSummary } from "@/lib/db";
import { PublicDashboardServer } from "@/components/PublicDashboardServer";
import { TurnoutCharts } from "@/components/TurnoutCharts";
import { PublicKpiCards } from "@/components/PublicKpiCards";
import { Footer } from "@/components/Footer";
import { HourlyProgressDashboard } from "@/components/HourlyProgressDashboard";

export default async function HomePage() {
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = Boolean(user);
  } catch {
    isAuthenticated = false;
  }

  const summary = await getDashboardSummary();

  return (
    <main>
      <Header />
      <div className="container-page space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Dashboard công khai</h2>
            <p className="page-subtitle">
              Hiển thị tổng quan tiến độ bỏ phiếu, biểu đồ thống kê và thời gian cập nhật mới nhất của từng khu vực trên địa bàn Phường Ayun Pa.
            </p>
          </div>
          <AuthButtons isAuthenticated={isAuthenticated} />
        </div>

        <PublicKpiCards data={summary} />
        <TurnoutCharts areas={summary.areas} />
<HourlyProgressDashboard mode="public" />
        <PublicDashboardServer areas={summary.areas} />
      </div>
      <Footer />
    </main>
  );
}
