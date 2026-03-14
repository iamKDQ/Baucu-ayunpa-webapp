import { User } from "@supabase/supabase-js";
import { AuthButtons } from "@/components/AuthButtons";
import { PublicBackHomeButton } from "@/components/PublicBackHomeButton";

export function AdminTopbar({ user }: { user: User | null }) {
  return (
    <section className="card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Khu vực quản trị</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">Bầu cử ĐBQH và HĐND các cấp - Phường Ayun Pa</h1>
          <p className="mt-2 text-stone-600">
            Quản lý tài khoản, phân quyền theo khu vực bỏ phiếu và tổng hợp báo cáo.
          </p>
          <p className="mt-2 text-sm text-stone-500">Tài khoản hiện tại: {user?.email ?? "Chưa đăng nhập"}</p>
<PublicBackHomeButton />
  <AuthButtons isAuthenticated={Boolean(user)} />
        </div>
        <AuthButtons isAuthenticated={Boolean(user)} />
      </div>
    </section>
  );
}
