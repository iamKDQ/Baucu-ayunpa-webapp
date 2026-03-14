"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type AreaOption = {
  id: string;
  area_number: number;
  area_name: string;
  total_voters: number;
  neighborhoods: string[];
  polling_place: string;
};

export function ProgressEntryForm({ areas }: { areas: AreaOption[] }) {
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [reportHour, setReportHour] = useState("8");
  const [votedCount, setVotedCount] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"draft" | "submitted">("submitted");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedArea = useMemo(
    () => areas.find((item) => item.id === areaId),
    [areas, areaId]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedArea) {
      setError("Chưa chọn khu vực bỏ phiếu.");
      return;
    }

    const numericVoted = Number(votedCount);
    if (!Number.isFinite(numericVoted) || numericVoted < 0) {
      setError("Số cử tri đã bỏ phiếu phải là số lớn hơn hoặc bằng 0.");
      return;
    }

    if (numericVoted > selectedArea.total_voters) {
      setError("Số cử tri đã bỏ phiếu không được lớn hơn tổng số cử tri của khu vực.");
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id ?? null;

      const payload = {
        polling_area_id: selectedArea.id,
        report_date: reportDate,
        report_hour: Number(reportHour),
        voted_count: numericVoted,
        note: note || null,
        status,
        created_by: userId,
        updated_by: userId
      };

      const { error: upsertError } = await supabase
        .from("progress_reports")
        .upsert(payload, {
          onConflict: "polling_area_id,report_date,report_hour"
        });

      if (upsertError) throw upsertError;

      setMessage("Đã lưu báo cáo tiến độ thành công.");
      setVotedCount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu dữ liệu thất bại.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Nhập tiến độ theo giờ</h2>
        <p className="mt-2 text-sm text-stone-600">
          Dùng tài khoản đã được gán quyền để nhập số cử tri đã bỏ phiếu theo từng khu vực.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Khu vực bỏ phiếu</label>
            <select className="input" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  KV {area.area_number} - {area.area_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Ngày báo cáo</label>
            <input className="input" type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
          </div>

          <div>
            <label className="label">Giờ báo cáo</label>
            <select className="input" value={reportHour} onChange={(e) => setReportHour(e.target.value)}>
              {Array.from({ length: 15 }).map((_, index) => {
                const hour = index + 8;
                return (
                  <option key={hour} value={String(hour)}>
                    {hour}h
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Số cử tri đã bỏ phiếu</label>
            <input
              className="input"
              type="number"
              min="0"
              value={votedCount}
              onChange={(e) => setVotedCount(e.target.value)}
              placeholder="Nhập số đã bỏ phiếu"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Ghi chú</label>
            <textarea
              className="input min-h-[120px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: cập nhật lần 2, tình hình ổn định..."
            />
          </div>

          <div>
            <label className="label">Trạng thái</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "submitted")}>
              <option value="draft">Lưu nháp</option>
              <option value="submitted">Gửi chính thức</option>
            </select>
          </div>
        </div>

        {message ? <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving} className="button-primary disabled:opacity-60">
            {saving ? "Đang lưu..." : "Lưu báo cáo"}
          </button>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-bold text-stone-900">Thông tin khu vực đã chọn</h2>
        {selectedArea ? (
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-stone-100 pb-3">
              <span className="font-medium text-stone-500">Khu vực</span>
              <span>{selectedArea.area_name}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-stone-100 pb-3">
              <span className="font-medium text-stone-500">Tổ dân phố</span>
              <span>{selectedArea.neighborhoods.join(", ")}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-stone-100 pb-3">
              <span className="font-medium text-stone-500">Địa điểm</span>
              <span>{selectedArea.polling_place}</span>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-stone-100 pb-3">
              <span className="font-medium text-stone-500">Tổng cử tri</span>
              <span>{selectedArea.total_voters}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-600">Chưa có dữ liệu khu vực.</p>
        )}
      </section>
    </form>
  );
}
