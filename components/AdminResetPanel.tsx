"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetElectionProgressData, resetElectionAllData } from "@/lib/actions";

const initialState = { ok: false, message: "" };

export function AdminResetPanel() {
  const [progressState, progressAction] = useFormState(resetElectionProgressData, initialState);
  const [allState, allAction] = useFormState(resetElectionAllData, initialState);

  return (
    <section className="card p-5">
      <h2 className="text-lg font-bold text-stone-900">Công cụ reset dữ liệu chạy thử</h2>
      <p className="mt-2 text-sm text-stone-600">
        Dùng khi cần chạy thử hệ thống rồi xóa dữ liệu để bắt đầu vận hành chính thức.
      </p>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <form action={progressAction} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <h3 className="font-semibold text-stone-900">Reset tiến độ bỏ phiếu</h3>
          <p className="mt-2 text-sm text-stone-600">
            Xóa toàn bộ báo cáo tiến độ đã nhập. Tổng số cử tri của từng khu vực được giữ nguyên.
          </p>
          <div className="mt-4">
            <SubmitButton label="Reset tiến độ" />
          </div>
          {progressState.message ? (
            <p className={`mt-3 text-sm ${progressState.ok ? "text-emerald-700" : "text-red-700"}`}>
              {progressState.message}
            </p>
          ) : null}
        </form>

        <form action={allAction} className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-stone-900">Reset toàn bộ dữ liệu thử nghiệm</h3>
          <p className="mt-2 text-sm text-stone-600">
            Xóa toàn bộ báo cáo tiến độ và đưa tổng số cử tri của 11 khu vực về 0 để nhập lại từ đầu.
          </p>
          <div className="mt-4">
            <SubmitButton label="Reset toàn bộ" danger />
          </div>
          {allState.message ? (
            <p className={`mt-3 text-sm ${allState.ok ? "text-emerald-700" : "text-red-700"}`}>
              {allState.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function SubmitButton({ label, danger = false }: { label: string; danger?: boolean }) {
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
