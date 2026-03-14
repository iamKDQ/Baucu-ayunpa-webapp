"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  updateUserPermissions,
  deleteManagedUser,
  toggleManagedUserActive
} from "@/lib/actions";

type UserItem = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  roles: string[];
  assignedAreas: string[];
  is_active: boolean;
};

type RoleItem = {
  code: string;
  name: string;
};

type AreaItem = {
  id: string;
  area_number: number;
  area_name: string;
};

const initialState = {
  ok: false,
  message: ""
};

export function RoleAssignmentManager({
  users,
  roles,
  areas
}: {
  users: UserItem[];
  roles: RoleItem[];
  areas: AreaItem[];
}) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [state, formAction] = useFormState(updateUserPermissions, initialState);
  const [deleteState, deleteAction] = useFormState(deleteManagedUser, initialState);
  const [toggleState, toggleAction] = useFormState(toggleManagedUserActive, initialState);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId]
  );

  const defaultRoleCode = useMemo(() => {
    if (!selectedUser) return "area_editor";

    const roleName = selectedUser.roles[0] ?? "";

    if (roleName.includes("Quản trị phường")) return "ward_admin";
    if (roleName.includes("Chỉ xem báo cáo")) return "viewer";
    return "area_editor";
  }, [selectedUser]);

  const assignedAreaNumbers = useMemo(() => {
    if (!selectedUser) return [];
    return selectedUser.assignedAreas
      .map((text) => {
        const match = text.match(/KV\\s+(\\d+)/i);
        return match ? Number(match[1]) : null;
      })
      .filter(Boolean) as number[];
  }, [selectedUser]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Chọn người dùng</h2>
        <p className="mt-2 text-sm text-stone-600">
          Chọn người dùng bên dưới để chỉnh sửa vai trò, khu vực được phân quyền, khóa hoặc xóa tài khoản.
        </p>

        <div className="mt-5 space-y-3">
          {users.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              Chưa có người dùng nào để phân quyền.
            </div>
          ) : null}

          {users.map((user) => {
            const active = user.id === selectedUserId;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-brand-500 bg-brand-50"
                    : "border-stone-200 bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-stone-900">
                    {user.full_name || "(Chưa có tên)"}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      user.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Đang hoạt động" : "Đã khóa"}
                  </span>
                </div>

                <div className="mt-1 text-sm text-stone-600">{user.email || "(Không có email)"}</div>
                <div className="mt-2 text-xs text-stone-500">
                  Vai trò: {user.roles.join(", ") || "Chưa gán"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Cập nhật phân quyền</h2>

        {selectedUser ? (
          <div className="mt-5 space-y-6">
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="userId" value={selectedUser.id} />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Họ tên</label>
                  <input className="input" value={selectedUser.full_name || ""} readOnly />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input className="input" value={selectedUser.email || ""} readOnly />
                </div>

                <div>
                  <label className="label">Điện thoại</label>
                  <input className="input" value={selectedUser.phone || ""} readOnly />
                </div>

                <div>
                  <label className="label">Vai trò</label>
                  <select className="input" name="roleCode" defaultValue={defaultRoleCode}>
                    {roles.map((role) => (
                      <option key={role.code} value={role.code}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Khu vực bỏ phiếu được phân quyền</label>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {areas.map((area) => {
                    const checked = assignedAreaNumbers.includes(area.area_number);
                    return (
                      <label
                        key={area.id}
                        className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm"
                      >
                        <input
                          type="checkbox"
                          name="pollingAreaIds"
                          value={area.id}
                          defaultChecked={checked}
                          className="mt-1"
                        />
                        <span>
                          <strong>KV {area.area_number}</strong>
                          <br />
                          {area.area_name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {state.message ? (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    state.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {state.message}
                </div>
              ) : null}

              <div className="flex gap-3">
                <SaveButton />
              </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              <form action={toggleAction} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <input type="hidden" name="userId" value={selectedUser.id} />
                <input
                  type="hidden"
                  name="isActive"
                  value={selectedUser.is_active ? "false" : "true"}
                />

                <h3 className="font-semibold text-stone-900">
                  {selectedUser.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  {selectedUser.is_active
                    ? "Người dùng sẽ không đăng nhập được sau khi khóa."
                    : "Cho phép người dùng đăng nhập trở lại."}
                </p>

                <div className="mt-4">
                  <ActionButton
                    label={selectedUser.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  />
                </div>

                {toggleState.message ? (
                  <p
                    className={`mt-3 text-sm ${
                      toggleState.ok ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {toggleState.message}
                  </p>
                ) : null}
              </form>

              <form
                action={deleteAction}
                className="rounded-2xl border border-red-200 bg-red-50 p-4"
              >
                <input type="hidden" name="userId" value={selectedUser.id} />

                <h3 className="font-semibold text-stone-900">Xóa tài khoản</h3>
                <p className="mt-2 text-sm text-stone-600">
                  Xóa người dùng khỏi hệ thống. Thao tác này sẽ xóa cả quyền và tài khoản đăng nhập.
                </p>

                <div className="mt-4">
                  <ActionButton label="Xóa tài khoản" danger />
                </div>

                {deleteState.message ? (
                  <p
                    className={`mt-3 text-sm ${
                      deleteState.ok ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {deleteState.message}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
            Chưa có người dùng nào để chỉnh sửa.
          </div>
        )}
      </section>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
      {pending ? "Đang lưu..." : "Lưu phân quyền"}
    </button>
  );
}

function ActionButton({ label, danger = false }: { label: string; danger?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={danger ? "button-primary disabled:opacity-60" : "button-secondary disabled:opacity-60"}
    >
      {pending ? "Đang xử lý..." : label}
    </button>
  );
}