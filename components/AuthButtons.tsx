"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function AuthButtons({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-3">
        <Link href="/login" className="button-secondary">Đăng nhập</Link>
        <Link href="/admin" className="button-primary">Vào khu vực quản trị</Link>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Link href="/admin" className="button-secondary">Khu vực quản trị</Link>
      <button type="button" onClick={handleLogout} className="button-primary">Đăng xuất</button>
    </div>
  );
}
