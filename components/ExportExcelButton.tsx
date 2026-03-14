"use client";

type Props = {
  rows: any[];
};

export default function ExportExcelButton({ rows }: Props) {
  function exportExcel() {
    if (!rows || rows.length === 0) {
      alert("Không có dữ liệu để xuất.");
      return;
    }

    const header = [
      "Khu vực",
      "Đơn vị bầu cử",
      "Số cử tri",
      "Số cử tri đã bỏ phiếu",
      "Tỷ lệ"
    ];

    const data = rows.map((r) => [
      `KV ${r.area_number}`,
      r.election_unit,
      r.total_voters,
      r.voted_count,
      `${r.rate ?? 0}%`
    ]);

    const csvContent =
      [header, ...data]
        .map((e) => e.join(","))
        .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bao-cao-cu-tri.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <button
      onClick={exportExcel}
      className="button-secondary"
    >
      Xuất Excel
    </button>
  );
}