import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Bầu cử ĐBQH và HĐND các cấp - Phường Ayun Pa</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900">Đăng nhập hệ thống</h1>
        <p className="mt-2 text-sm text-stone-600">Trang này đã sẵn sàng để dùng với Supabase Auth. Hãy tạo user đầu tiên theo hướng dẫn trong file README và script SQL.</p>
        <Suspense><LoginForm /></Suspense>
        <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
          <p className="font-medium text-stone-900">Tài khoản mẫu đề xuất</p>
          <p className="mt-1">Email: admin@ayunpa.local</p>
          <p>Mật khẩu: 12345678</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/" className="text-brand-700 hover:underline">Quay lại dashboard</Link>
          <span className="text-stone-500">Supabase Auth ready</span>
        </div>
      </div>
    </main>
  );
}
