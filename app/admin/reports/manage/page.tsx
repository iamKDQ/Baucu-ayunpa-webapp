import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopbar } from "@/components/AdminTopbar";
import { getPollingAreas } from "@/lib/db";
import {
  editAreaProgressReport,
  deleteAreaProgressReport,
  saveNeighborhoodReport,
  deleteNeighborhoodReport
} from "@/lib/actions";

async function isAdminUser(userId: string) {
  const admin = createAdminClient();

  const userRolesRes = await admin
    .from("user_roles")
    .select("role_id")
    .eq("user_id", userId);

  if (userRolesRes.error) return false;

  const roleIds = (userRolesRes.data ?? [])
    .map((item: any) => item.role_id)
    .filter(Boolean);

  if (roleIds.length === 0) return false;

  const rolesRes = await admin
    .from("roles")
    .select("id, code")
    .in("id", roleIds);

  if (rolesRes.error) return false;

  const roleCodes = (rolesRes.data ?? [])
    .map((item: any) => item.code)
    .filter(Boolean);

  return roleCodes.includes("super_admin") || roleCodes.includes("ward_admin");
}

type PageProps = {
  searchParams?: {
    status?: string;
    message?: string;
  };
};

export default async function ManageReportsPage({ searchParams }: PageProps) {
  const params = searchParams ?? {};

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AdminTopbar user={null} />
            <section className="card p-5">
              <h1 className="text-2xl font-bold text-stone-900">
                Không có quyền truy cập
              </h1>
              <p className="mt-2 text-stone-600">
                Bạn cần đăng nhập bằng tài khoản quản trị để vào trang này.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const isAdmin = await isAdminUser(user.id);

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />
          <div className="space-y-6">
            <AdminTopbar user={user} />
            <section className="card p-5">
              <h1 className="text-2xl font-bold text-stone-900">
                Không có quyền truy cập
              </h1>
              <p className="mt-2 text-stone-600">
                Tài khoản của bạn không được phép hiệu chỉnh báo cáo.
              </p>
            </section>
          </div>
        </div>
      </main>
    );
  }

  const admin = createAdminClient();

  const [areas, progressRes, neighborhoodRes] = await Promise.all([
    getPollingAreas(),
    admin
      .from("progress_reports")
      .select("*")
      .order("report_date", { ascending: false })
      .order("report_hour", { ascending: false }),
    admin
      .from("neighborhood_reports")
      .select("*")
      .order("report_date", { ascending: false })
      .order("report_hour", { ascending: false })
  ]);

  const progressRows = progressRes.data ?? [];
  const neighborhoodRows = neighborhoodRes.data ?? [];

  function areaName(areaId: string) {
    const area = areas.find((x) => x.id === areaId);
    return area ? `Khu vực bầu cử số ${area.area_number}` : areaId;
  }

  const message = params.message ?? "";
  const ok = params.status === "ok";

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <div className="space-y-6">
          <AdminTopbar user={user} />

          <section className="card p-5">
            <h1 className="text-2xl font-bold text-stone-900">
              Hiệu chỉnh báo cáo
            </h1>
            <p className="mt-2 text-stone-600">
              Admin có thể sửa, xóa số liệu khu vực để chạy thử; đồng thời
              nhập hoặc hiệu chỉnh số liệu theo Tổ dân phố khi báo cáo sai.
            </p>

            {message ? (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            ) : null}
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">
              Nhập / hiệu chỉnh số liệu theo Tổ dân phố
            </h2>

            <form
              action={saveNeighborhoodReport}
              className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              <div>
                <label className="label">Khu vực bỏ phiếu</label>
                <select className="input" name="pollingAreaId" required>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      Khu vực bầu cử số {area.area_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Tên Tổ dân phố</label>
                <input
                  className="input"
                  name="neighborhoodName"
                  placeholder="Ví dụ: TDP 1"
                  required
                />
              </div>

              <div>
                <label className="label">Ngày báo cáo</label>
                <input
                  className="input"
                  type="date"
                  name="reportDate"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>

              <div>
                <label className="label">Giờ báo cáo</label>
                <input
                  className="input"
                  type="number"
                  step="0.25"
                  min="5"
                  max="22"
                  name="reportHour"
                  required
                />
              </div>

              <div>
                <label className="label">Tổng cử tri Tổ</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="totalVoters"
                  required
                />
              </div>

              <div>
                <label className="label">Đã bỏ phiếu</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  name="votedCount"
                  required
                />
              </div>

              <div className="md:col-span-2 xl:col-span-3">
                <label className="label">Ghi chú</label>
                <textarea className="input min-h-[100px]" name="note" />
              </div>

              <div>
                <button type="submit" className="button-primary">
                  Lưu số liệu theo Tổ
                </button>
              </div>
            </form>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">
              Chỉnh sửa báo cáo khu vực
            </h2>

            <div className="mt-4 space-y-4">
              {progressRows.map((row: any) => (
                <form
                  key={row.id}
                  action={editAreaProgressReport}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                >
                  <input type="hidden" name="reportId" value={row.id} />

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="label">Khu vực</label>
                      <select
                        className="input"
                        name="pollingAreaId"
                        defaultValue={row.polling_area_id}
                      >
                        {areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            Khu vực bầu cử số {area.area_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Ngày</label>
                      <input
                        className="input"
                        type="date"
                        name="reportDate"
                        defaultValue={row.report_date}
                      />
                    </div>

                    <div>
                      <label className="label">Giờ</label>
                      <input
                        className="input"
                        type="number"
                        step="0.25"
                        min="5"
                        max="22"
                        name="reportHour"
                        defaultValue={row.report_hour}
                      />
                    </div>

                    <div>
                      <label className="label">Đã bỏ phiếu</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        name="votedCount"
                        defaultValue={row.voted_count}
                      />
                    </div>

                    <div>
                      <label className="label">Trạng thái</label>
                      <select
                        className="input"
                        name="status"
                        defaultValue={row.status}
                      >
                        <option value="draft">Lưu nháp</option>
                        <option value="submitted">Đã gửi</option>
                        <option value="approved">Đã duyệt</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 xl:col-span-3">
                      <label className="label">Ghi chú</label>
                      <input
                        className="input"
                        name="note"
                        defaultValue={row.note ?? ""}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button type="submit" className="button-primary">
                      Lưu chỉnh sửa
                    </button>
                  </div>
                </form>
              ))}

              {progressRows.length === 0 ? (
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
                  Chưa có báo cáo khu vực nào.
                </div>
              ) : null}
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Giờ</th>
                    <th className="px-4 py-3">Đã bỏ phiếu</th>
                    <th className="px-4 py-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {progressRows.map((row: any) => (
                    <tr key={row.id} className="border-t border-stone-100">
                      <td className="px-4 py-3">
                        {areaName(row.polling_area_id)}
                      </td>
                      <td className="px-4 py-3">{row.report_date}</td>
                      <td className="px-4 py-3">{row.report_hour}</td>
                      <td className="px-4 py-3">{row.voted_count}</td>
                      <td className="px-4 py-3">
                        <form action={deleteAreaProgressReport}>
                          <input type="hidden" name="reportId" value={row.id} />
                          <button type="submit" className="button-secondary">
                            Xóa
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}

                  {progressRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-stone-500">
                        Chưa có báo cáo khu vực nào.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="text-lg font-bold text-stone-900">
              Danh sách báo cáo theo Tổ dân phố
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-stone-50 text-left text-stone-600">
                  <tr>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Tổ</th>
                    <th className="px-4 py-3">Ngày</th>
                    <th className="px-4 py-3">Giờ</th>
                    <th className="px-4 py-3">Tổng cử tri</th>
                    <th className="px-4 py-3">Đã bỏ phiếu</th>
                    <th className="px-4 py-3">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {neighborhoodRows.map((row: any) => (
                    <tr key={row.id} className="border-t border-stone-100">
                      <td className="px-4 py-3">
                        {areaName(row.polling_area_id)}
                      </td>
                      <td className="px-4 py-3">{row.neighborhood_name}</td>
                      <td className="px-4 py-3">{row.report_date}</td>
                      <td className="px-4 py-3">{row.report_hour}</td>
                      <td className="px-4 py-3">{row.total_voters}</td>
                      <td className="px-4 py-3">{row.voted_count}</td>
                      <td className="px-4 py-3">
                        <form action={deleteNeighborhoodReport}>
                          <input type="hidden" name="reportId" value={row.id} />
                          <button type="submit" className="button-secondary">
                            Xóa
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}

                  {neighborhoodRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-stone-500">
                        Chưa có số liệu theo Tổ dân phố.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}