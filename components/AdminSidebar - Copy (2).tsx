import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  MapPinned,
  ClipboardPenLine,
  SquarePen
} from "lucide-react";

const items = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/progress", label: "Nhập tiến độ", icon: ClipboardPenLine },
  { href: "/admin/areas", label: "Khu vực bỏ phiếu", icon: MapPinned },
  { href: "/admin/users", label: "Người dùng", icon: Users },
  { href: "/admin/reports", label: "Báo cáo", icon: FileText },
  { href: "/admin/reports/manage", label: "Hiệu chỉnh báo cáo", icon: SquarePen },
  { href: "/admin/roles", label: "Phân quyền", icon: ShieldCheck }
];

export function AdminSidebar() {
  return (
    <aside className="card p-4">
      <h2 className="mb-4 text-lg font-bold text-stone-900">
        Quản trị hệ thống
      </h2>

      <nav className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}