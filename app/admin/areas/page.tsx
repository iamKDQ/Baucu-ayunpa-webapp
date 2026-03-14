import { AdminSidebar } from "@/components/AdminSidebar";
import { pollingAreas } from "@/lib/mock-data";

export default function AreasPage() {
  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <section className="card p-5">
          <h1 className="text-2xl font-bold text-stone-900">Khu vực bỏ phiếu</h1>
          <p className="mt-2 text-stone-600">
            Cấu hình cố định 11 khu vực bỏ phiếu thuộc Phường Ayun Pa.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pollingAreas.map((item) => (
              <article key={item.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <h2 className="font-bold text-stone-900">{item.areaName}</h2>
                <p className="mt-1 text-sm text-stone-600">{item.unitName}</p>
                <p className="mt-3 text-sm"><strong>Tổ dân phố:</strong> {item.neighborhoods.join(", ")}</p>
                <p className="mt-2 text-sm"><strong>Địa điểm:</strong> {item.pollingPlace}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
