"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createManagedUser } from "@/lib/actions";

type AreaItem = {
  id: string;
  area_number: number;
  area_name: string;
};

export function CreateManagedUserForm({ areas }: { areas: AreaItem[] }) {
  const [state, formAction] = useFormState(createManagedUser, {
    ok: false,
    message: ""
  });

  return (
    <form action={formAction} className="card p-5">
      <h2 className="text-lg font-bold text-stone-900">Tạo tài khoản và phân quyền</h2>
      <p className="mt-2 text-sm text-stone-600">
        Admin có thể tạo tài khoản, gán vai trò và chỉ định đúng khu vực bỏ phiếu mà người dùng được nhập liệu.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Họ và tên</label>
          <input className="input" name="fullName" placeholder="Nhập họ tên" required />
        </div>
        <div>
          <label className="label">Số điện thoại</label>
          <input className="input" name="phone" placeholder="Nhập số điện thoại" />
        </div>
        <div>
          <label className="label">Email đăng nhập</label>
          <input className="input" name="email" type="email" placeholder="vd: kv1@ayunpa.local" required />
        </div>
        <div>
          <label className="label">Mật khẩu ban đầu</label>
          <input className="input" name="password" type="password" placeholder="Ít nhất 6 ký tự" required />
        </div>
        <div>
          <label className="label">Vai trò</label>
          <select className="input" name="roleCode" defaultValue="area_editor">
            <option value="ward_admin">Quản trị phường</option>
            <option value="area_editor">Nhập liệu theo khu vực</option>
            <option value="viewer">Chỉ xem báo cáo</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="label">Phân quyền theo khu vực bỏ phiếu</label>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((item) => (
            <label key={item.id} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm">
              <input type="checkbox" name="pollingAreaIds" value={item.id} className="mt-1" />
              <span>
                <strong>KV {item.area_number}</strong>
                <br />
                {item.area_name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {state.message ? (
        <div
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
      {pending ? "Đang tạo..." : "Tạo tài khoản"}
    </button>
  );
}
