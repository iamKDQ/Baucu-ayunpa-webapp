"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveProgressReport } from "@/lib/actions";
import { useMemo, useState } from "react";

type AreaOption = {
  id: string;
  area_number: number;
  area_name: string;
  total_voters: number;
  neighborhoods: string[];
  polling_place: string;
};

const quickMilestones = [
  { value: "8", label: "8h sáng" },
  { value: "10.5", label: "10h30 sáng" },
  { value: "14", label: "14h chiều" },
  { value: "18", label: "18h chiều" },
  { value: "21", label: "21h tối" }
];

function getCurrentReportHour() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const decimalHour = hour + (minute >= 30 ? 0.5 : 0);

  if (decimalHour < 5) return 5;
  if (decimalHour > 22) return 22;

  return decimalHour;
}

export function ProgressEntryServerForm({ areas }: { areas: AreaOption[] }) {
  const [selectedId, setSelectedId] = useState(areas[0]?.id ?? "");
  const [reportHour, setReportHour] = useState(String(getCurrentReportHour()));
  const [state, formAction] = useFormState(saveProgressReport, {
    ok: false,
    message: ""
  });

  const selectedArea = useMemo(
    () => areas.find((item) => item.id === selectedId),
    [areas, selectedId]
  );

  return (
    <form action={formAction} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Nhập tiến độ theo khu vực bỏ phiếu</h2>
        <p className="mt-2 text-sm text-stone-600">
          Mặc định giờ báo cáo lấy theo thời điểm hiện tại. Bạn cũng có thể chọn nhanh các mốc quy định hoặc tự chỉnh lại giờ báo cáo.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Khu vực bỏ phiếu được phân quyền</label>
            <select
              className="input"
              name="pollingAreaId"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {areas.map((item) => (
                <option key={item.id} value={item.id}>
                  KV {item.area_number} - {item.area_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Ngày báo cáo</label>
            <input
              className="input"
              type="date"
              name="reportDate"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>

          <div>
            <label className="label">Giờ báo cáo thực tế</label>
            <input
              className="input"
              type="number"
              name="reportHour"
              min="5"
              max="22"
              step="0.5"
              value={reportHour}
              onChange={(e) => setReportHour(e.target.value)}
              required
            />
            <p className="mt-1 text-xs text-stone-500">
              Ví dụ: 8, 10.5, 14, 15.5, 18, 21
            </p>
          </div>

          <div>
            <label className="label">Chọn nhanh mốc giờ quy định</label>
            <select
              className="input"
              value={reportHour}
              onChange={(e) => setReportHour(e.target.value)}
            >
              <option value={reportHour}>Giữ giờ hiện tại / giờ đang nhập</option>
              {quickMilestones.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Tổng số cử tri khu vực</label>
            <input
              className="input"
              type="number"
              min="0"
              name="totalVoters"
              defaultValue={selectedArea?.total_voters ?? 0}
              key={`total-${selectedId}-${selectedArea?.total_voters ?? 0}`}
              required
            />
          </div>

          <div>
            <label className="label">Số cử tri đã bỏ phiếu hiện tại</label>
            <input
              className="input"
              type="number"
              min="0"
              name="votedCount"
              placeholder="Nhập số đã bỏ phiếu"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Ghi chú</label>
            <textarea
              className="input min-h-[120px]"
              name="note"
              placeholder="Ví dụ: cập nhật bổ sung theo tình hình thực tế..."
            />
          </div>

          <div>
            <label className="label">Trạng thái</label>
            <select className="input" name="status" defaultValue="submitted">
              <option value="draft">Lưu nháp</option>
              <option value="submitted">Gửi chính thức</option>
            </select>
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

        <div className="mt-6 flex gap-3">
          <SubmitButton />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Thông tin khu vực đã chọn</h2>
        {selectedArea ? (
          <div className="mt-4 space-y-3 text-sm">
            <InfoRow label="Khu vực" value={selectedArea.area_name} />
            <InfoRow label="Tổ dân phố" value={(selectedArea.neighborhoods ?? []).join(", ")} />
            <InfoRow label="Địa điểm" value={selectedArea.polling_place} />
            <InfoRow label="Tổng cử tri hiện có" value={String(selectedArea.total_voters)} />
            <InfoRow label="Giờ báo cáo đang chọn" value={reportHour} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-600">Bạn chưa được phân quyền khu vực nào.</p>
        )}
      </section>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="button-primary disabled:opacity-60">
      {pending ? "Đang lưu..." : "Lưu báo cáo"}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-stone-100 pb-3">
      <span className="font-medium text-stone-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}