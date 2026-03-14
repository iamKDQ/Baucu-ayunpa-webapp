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
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

async function getCurrentRoleCodes() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return [];

  const admin = createAdminClient();

  const userRolesRes = await admin
    .from("user_roles")
    .select("role_id")
    .eq("user_id", user.id);

  if (userRolesRes.error) return [];

  const roleIds = (userRolesRes.data ?? [])
    .map((item: any) => item.role_id)
    .filter(Boolean);

  if (roleIds.length === 0) return [];

  const rolesRes = await admin
    .from("roles")
    .select("id, code")
    .in("id", roleIds);

  if (rolesRes.error) return [];

  return (rolesRes.data ?? []).map((item: any) => item.code).filter(Boolean);
}

export async function AdminSidebar() {
  const roleCodes = await getCurrentRoleCodes();

  const isAdmin =
    roleCodes.includes("super_admin") || roleCodes.includes("ward_admin");
  const canEditArea = isAdmin || roleCodes.includes("area_editor");
  const canViewReports = isAdmin || roleCodes.includes("viewer") || roleCodes.includes("area_editor");

  const items = [
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, show: true },
    {
      href: "/admin/progress",
      label: "Nhập tiến độ",
      icon: ClipboardPenLine,
      show: canEditArea
    },
    {
      href: "/admin/areas",
      label: "Khu vực bỏ phiếu",
      icon: MapPinned,
      show: isAdmin
    },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: Users,
      show: isAdmin
    },
    {
      href: "/admin/reports",
      label: "Báo cáo",
      icon: FileText,
      show: canViewReports
    },
    {
      href: "/admin/reports/manage",
      label: "Hiệu chỉnh báo cáo",
      icon: SquarePen,
      show: isAdmin
    },
    {
      href: "/admin/roles",
      label: "Phân quyền",
      icon: ShieldCheck,
      show: isAdmin
    }
  ];

  return (
    <aside className="card p-4">
      <h2 className="mb-4 text-lg font-bold text-stone-900">
        Quản trị hệ thống
      </h2>

      <nav className="space-y-2">
        {items
          .filter((item) => item.show)
          .map(({ href, label, icon: Icon }) => (
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