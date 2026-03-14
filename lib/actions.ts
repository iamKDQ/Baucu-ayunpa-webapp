"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

const areaUpdateSchema = z.object({
  areaId: z.string().min(1),
  totalVoters: z.coerce.number().int().min(0)
});

const progressSchema = z.object({
  pollingAreaId: z.string().min(1),
  reportDate: z.string().min(1),
  reportHour: z.coerce.number().min(5).max(22),
  totalVoters: z.coerce.number().int().min(0),
  votedCount: z.coerce.number().int().min(0),
  note: z.string().optional(),
  status: z.enum(["draft", "submitted"])
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  phone: z.string().optional(),
  roleCode: z.enum(["ward_admin", "area_editor", "viewer"])
});

const updateUserPermissionsSchema = z.object({
  userId: z.string().min(1),
  roleCode: z.enum(["ward_admin", "area_editor", "viewer"])
});

const deleteUserSchema = z.object({
  userId: z.string().min(1)
});

const toggleUserSchema = z.object({
  userId: z.string().min(1),
  isActive: z.enum(["true", "false"])
});

const editProgressSchema = z.object({
  reportId: z.string().min(1),
  pollingAreaId: z.string().min(1),
  reportDate: z.string().min(1),
  reportHour: z.coerce.number().min(5).max(22),
  votedCount: z.coerce.number().int().min(0),
  note: z.string().optional(),
  status: z.enum(["draft", "submitted", "approved"])
});

const deleteProgressSchema = z.object({
  reportId: z.string().min(1)
});

const neighborhoodReportSchema = z.object({
  pollingAreaId: z.string().min(1),
  neighborhoodName: z.string().min(1),
  reportDate: z.string().min(1),
  reportHour: z.coerce.number().min(5).max(22),
  totalVoters: z.coerce.number().int().min(0),
  votedCount: z.coerce.number().int().min(0),
  note: z.string().optional()
});

const deleteNeighborhoodReportSchema = z.object({
  reportId: z.string().min(1)
});

function redirectManageReports(status: "ok" | "error", message: string): never {
  redirect(
    `/admin/reports/manage?status=${status}&message=${encodeURIComponent(message)}`
  );
}

async function ensureAdminPermission() {
  const supabase = await createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập để thực hiện chức năng này.");
  }

  const admin = createAdminClient();

  const userRolesRes = await admin
    .from("user_roles")
    .select("role_id")
    .eq("user_id", user.id);

  if (userRolesRes.error) {
    throw new Error("Không kiểm tra được quyền người dùng.");
  }

  const roleIds = (userRolesRes.data ?? [])
    .map((item: any) => item.role_id)
    .filter(Boolean);

  if (roleIds.length === 0) {
    throw new Error("Bạn không có quyền thực hiện chức năng quản trị này.");
  }

  const rolesRes = await admin
    .from("roles")
    .select("id, code")
    .in("id", roleIds);

  if (rolesRes.error) {
    throw new Error("Không kiểm tra được vai trò người dùng.");
  }

  const roleCodes = (rolesRes.data ?? [])
    .map((item: any) => item.code)
    .filter(Boolean);

  const isAdmin =
    roleCodes.includes("super_admin") || roleCodes.includes("ward_admin");

  if (!isAdmin) {
    throw new Error("Bạn không có quyền thực hiện chức năng quản trị này.");
  }

  return { userId: user.id };
}

export async function updateAreaTotalVoters(_: unknown, formData: FormData) {
  try {
    const input = areaUpdateSchema.parse({
      areaId: formData.get("areaId"),
      totalVoters: formData.get("totalVoters")
    });

    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("polling_areas")
      .update({ total_voters: input.totalVoters })
      .eq("id", input.areaId);

    if (error) return { ok: false, message: error.message };

    revalidatePath("/admin");
    revalidatePath("/admin/areas");
    revalidatePath("/");
    revalidatePath("/admin/reports");

    return { ok: true, message: "Đã cập nhật tổng số cử tri." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Cập nhật thất bại."
    };
  }
}

export async function saveProgressReport(_: unknown, formData: FormData) {
  try {
    const input = progressSchema.parse({
      pollingAreaId: formData.get("pollingAreaId"),
      reportDate: formData.get("reportDate"),
      reportHour: formData.get("reportHour"),
      totalVoters: formData.get("totalVoters"),
      votedCount: formData.get("votedCount"),
      note: formData.get("note") || undefined,
      status: formData.get("status")
    });

    const supabase = await createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    if (input.votedCount > input.totalVoters) {
      return {
        ok: false,
        message: "Số đã bỏ phiếu không được lớn hơn tổng số cử tri."
      };
    }

    const { error: updateAreaError } = await supabase
      .from("polling_areas")
      .update({ total_voters: input.totalVoters })
      .eq("id", input.pollingAreaId);

    if (updateAreaError) {
      return { ok: false, message: updateAreaError.message };
    }

    const { error } = await supabase.from("progress_reports").upsert(
      {
        polling_area_id: input.pollingAreaId,
        report_date: input.reportDate,
        report_hour: input.reportHour,
        voted_count: input.votedCount,
        note: input.note || null,
        status: input.status,
        created_by: userId,
        updated_by: userId
      },
      { onConflict: "polling_area_id,report_date,report_hour" }
    );

    if (error) return { ok: false, message: error.message };

    revalidatePath("/");
    revalidatePath("/missing-reports");
    revalidatePath("/admin");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/reports/manage");

    return { ok: true, message: "Đã lưu báo cáo tiến độ theo khu vực." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Lưu báo cáo thất bại."
    };
  }
}

/**
 * Các action dưới đây dùng trực tiếp với:
 * <form action={...}>
 * nên PHẢI nhận 1 tham số duy nhất là formData
 */

export async function editAreaProgressReport(formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = editProgressSchema.parse({
      reportId: formData.get("reportId"),
      pollingAreaId: formData.get("pollingAreaId"),
      reportDate: formData.get("reportDate"),
      reportHour: formData.get("reportHour"),
      votedCount: formData.get("votedCount"),
      note: formData.get("note") || undefined,
      status: formData.get("status")
    });

    const admin = createAdminClient();

    const { error } = await admin
      .from("progress_reports")
      .update({
        polling_area_id: input.pollingAreaId,
        report_date: input.reportDate,
        report_hour: input.reportHour,
        voted_count: input.votedCount,
        note: input.note || null,
        status: input.status
      })
      .eq("id", input.reportId);

    if (error) {
      redirectManageReports("error", error.message);
    }

    revalidatePath("/");
    revalidatePath("/missing-reports");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/reports/manage");

    redirectManageReports("ok", "Đã chỉnh sửa báo cáo khu vực.");
  } catch (error) {
    redirectManageReports(
      "error",
      error instanceof Error ? error.message : "Chỉnh sửa báo cáo thất bại."
    );
  }
}

export async function deleteAreaProgressReport(formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = deleteProgressSchema.parse({
      reportId: formData.get("reportId")
    });

    const admin = createAdminClient();

    const { error } = await admin
      .from("progress_reports")
      .delete()
      .eq("id", input.reportId);

    if (error) {
      redirectManageReports("error", error.message);
    }

    revalidatePath("/");
    revalidatePath("/missing-reports");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/reports/manage");

    redirectManageReports("ok", "Đã xóa báo cáo khu vực.");
  } catch (error) {
    redirectManageReports(
      "error",
      error instanceof Error ? error.message : "Xóa báo cáo thất bại."
    );
  }
}

export async function saveNeighborhoodReport(formData: FormData) {
  try {
    const { userId } = await ensureAdminPermission();

    const input = neighborhoodReportSchema.parse({
      pollingAreaId: formData.get("pollingAreaId"),
      neighborhoodName: formData.get("neighborhoodName"),
      reportDate: formData.get("reportDate"),
      reportHour: formData.get("reportHour"),
      totalVoters: formData.get("totalVoters"),
      votedCount: formData.get("votedCount"),
      note: formData.get("note") || undefined
    });

    if (input.votedCount > input.totalVoters) {
      redirectManageReports(
        "error",
        "Số đã bỏ phiếu không được lớn hơn tổng số cử tri của Tổ."
      );
    }

    const admin = createAdminClient();

    const { error } = await admin.from("neighborhood_reports").upsert(
      {
        polling_area_id: input.pollingAreaId,
        neighborhood_name: input.neighborhoodName,
        report_date: input.reportDate,
        report_hour: input.reportHour,
        total_voters: input.totalVoters,
        voted_count: input.votedCount,
        note: input.note || null,
        created_by: userId,
        updated_by: userId
      },
      {
        onConflict:
          "polling_area_id,neighborhood_name,report_date,report_hour"
      }
    );

    if (error) {
      redirectManageReports("error", error.message);
    }

    revalidatePath("/admin/reports");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports/manage");

    redirectManageReports("ok", "Đã lưu số liệu báo cáo theo Tổ.");
  } catch (error) {
    redirectManageReports(
      "error",
      error instanceof Error ? error.message : "Lưu báo cáo theo Tổ thất bại."
    );
  }
}

export async function deleteNeighborhoodReport(formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = deleteNeighborhoodReportSchema.parse({
      reportId: formData.get("reportId")
    });

    const admin = createAdminClient();

    const { error } = await admin
      .from("neighborhood_reports")
      .delete()
      .eq("id", input.reportId);

    if (error) {
      redirectManageReports("error", error.message);
    }

    revalidatePath("/admin/reports");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports/manage");

    redirectManageReports("ok", "Đã xóa báo cáo theo Tổ.");
  } catch (error) {
    redirectManageReports(
      "error",
      error instanceof Error ? error.message : "Xóa báo cáo theo Tổ thất bại."
    );
  }
}

export async function createManagedUser(_: unknown, formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = createUserSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
      phone: formData.get("phone") || undefined,
      roleCode: formData.get("roleCode")
    });

    const areaIds = formData.getAll("pollingAreaIds").map(String).filter(Boolean);

    if (input.roleCode === "area_editor" && areaIds.length === 0) {
      return {
        ok: false,
        message: "Người nhập liệu phải được gán ít nhất 1 khu vực."
      };
    }

    const admin = createAdminClient();

    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        user_metadata: { full_name: input.fullName },
        email_confirm: true
      });

    if (createError || !created.user) {
      return {
        ok: false,
        message: createError?.message || "Không tạo được tài khoản."
      };
    }

    const roleRes = await admin
      .from("roles")
      .select("id")
      .eq("code", input.roleCode)
      .single();

    if (roleRes.error || !roleRes.data) {
      return { ok: false, message: "Không tìm thấy vai trò." };
    }

    await admin.from("profiles").upsert({
      id: created.user.id,
      full_name: input.fullName,
      phone: input.phone || null,
      is_active: true
    });

    await admin.from("user_roles").insert({
      user_id: created.user.id,
      role_id: roleRes.data.id
    });

    if (areaIds.length > 0) {
      await admin.from("area_assignments").insert(
        areaIds.map((id) => ({
          user_id: created.user.id,
          polling_area_id: id,
          can_edit: true
        }))
      );
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/roles");

    return {
      ok: true,
      message: "Đã tạo tài khoản và gán quyền thành công."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Tạo tài khoản thất bại."
    };
  }
}

export async function updateUserPermissions(_: unknown, formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = updateUserPermissionsSchema.parse({
      userId: formData.get("userId"),
      roleCode: formData.get("roleCode")
    });

    const pollingAreaIds = formData
      .getAll("pollingAreaIds")
      .map((item) => String(item))
      .filter(Boolean);

    if (input.roleCode === "area_editor" && pollingAreaIds.length === 0) {
      return {
        ok: false,
        message: "Người nhập liệu theo khu vực phải được gán ít nhất 1 khu vực."
      };
    }

    const admin = createAdminClient();

    const roleRes = await admin
      .from("roles")
      .select("id")
      .eq("code", input.roleCode)
      .single();

    if (roleRes.error || !roleRes.data) {
      return { ok: false, message: "Không tìm thấy vai trò." };
    }

    const deleteRolesRes = await admin
      .from("user_roles")
      .delete()
      .eq("user_id", input.userId);

    if (deleteRolesRes.error) {
      return { ok: false, message: deleteRolesRes.error.message };
    }

    const insertRoleRes = await admin.from("user_roles").insert({
      user_id: input.userId,
      role_id: roleRes.data.id
    });

    if (insertRoleRes.error) {
      return { ok: false, message: insertRoleRes.error.message };
    }

    const deleteAssignmentsRes = await admin
      .from("area_assignments")
      .delete()
      .eq("user_id", input.userId);

    if (deleteAssignmentsRes.error) {
      return { ok: false, message: deleteAssignmentsRes.error.message };
    }

    if (pollingAreaIds.length > 0) {
      const insertAssignmentsRes = await admin.from("area_assignments").insert(
        pollingAreaIds.map((id) => ({
          user_id: input.userId,
          polling_area_id: id,
          can_edit: true
        }))
      );

      if (insertAssignmentsRes.error) {
        return { ok: false, message: insertAssignmentsRes.error.message };
      }
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/roles");
    revalidatePath("/admin/progress");

    return {
      ok: true,
      message: "Đã cập nhật phân quyền người dùng."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Cập nhật phân quyền thất bại."
    };
  }
}

export async function deleteManagedUser(_: unknown, formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = deleteUserSchema.parse({
      userId: formData.get("userId")
    });

    const admin = createAdminClient();

    await admin.from("area_assignments").delete().eq("user_id", input.userId);
    await admin.from("user_roles").delete().eq("user_id", input.userId);
    await admin.from("profiles").delete().eq("id", input.userId);

    const { error } = await admin.auth.admin.deleteUser(input.userId);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/roles");

    return {
      ok: true,
      message: "Đã xóa tài khoản người dùng."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Xóa tài khoản thất bại."
    };
  }
}

export async function toggleManagedUserActive(_: unknown, formData: FormData) {
  try {
    await ensureAdminPermission();

    const input = toggleUserSchema.parse({
      userId: formData.get("userId"),
      isActive: formData.get("isActive")
    });

    const admin = createAdminClient();
    const nextActive = input.isActive === "true";

    const { error } = await admin.auth.admin.updateUserById(input.userId, {
      ban_duration: nextActive ? "none" : "876000h"
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    await admin
      .from("profiles")
      .update({ is_active: nextActive })
      .eq("id", input.userId);

    revalidatePath("/admin/users");
    revalidatePath("/admin/roles");

    return {
      ok: true,
      message: nextActive
        ? "Đã mở khóa tài khoản."
        : "Đã khóa tài khoản."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Thao tác khóa/mở khóa thất bại."
    };
  }
}

export async function resetElectionProgressData() {
  try {
    await ensureAdminPermission();

    const supabase = await createServerSupabase();
    const { error } = await supabase
      .from("progress_reports")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/missing-reports");
    revalidatePath("/admin");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/reports/manage");

    return {
      ok: true,
      message:
        "Đã reset toàn bộ tiến độ bỏ phiếu. Tổng số cử tri các khu vực được giữ nguyên."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Reset tiến độ thất bại."
    };
  }
}

export async function resetElectionAllData() {
  try {
    await ensureAdminPermission();

    const supabase = await createServerSupabase();

    const deleteRes = await supabase
      .from("progress_reports")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteRes.error) {
      return { ok: false, message: deleteRes.error.message };
    }

    const deleteNeighborhoodRes = await supabase
      .from("neighborhood_reports")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (deleteNeighborhoodRes.error) {
      return { ok: false, message: deleteNeighborhoodRes.error.message };
    }

    const updateRes = await supabase
      .from("polling_areas")
      .update({ total_voters: 0 })
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (updateRes.error) {
      return { ok: false, message: updateRes.error.message };
    }

    revalidatePath("/");
    revalidatePath("/missing-reports");
    revalidatePath("/admin");
    revalidatePath("/admin/areas");
    revalidatePath("/admin/progress");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/reports/manage");

    return {
      ok: true,
      message:
        "Đã reset toàn bộ dữ liệu thử nghiệm. Hãy nhập lại tổng số cử tri và tiến độ chính thức."
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Reset toàn bộ dữ liệu thất bại."
    };
  }
}