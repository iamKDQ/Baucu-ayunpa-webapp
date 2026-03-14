export function RequireAdminNotice() {
  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container-page">
        <section className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            Khu vực quản trị
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            Bạn cần đăng nhập để vào khu vực quản trị
          </h1>
          <p className="mt-3 text-stone-700">
            Vui lòng đăng nhập bằng tài khoản được phân quyền để truy cập các chức năng quản trị và báo cáo.
          </p>
        </section>
      </div>
    </main>
  );
}
