import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { kpiSummary, pollingAreas as mockAreas } from "@/lib/mock-data";
import { getCurrentRealHour, formatHourLabel } from "@/lib/report-utils";

export type ProgressRow = {
  id: string;
  polling_area_id: string;
  report_date: string;
  report_hour: number;
  voted_count: number;
  note: string | null;
  status: "draft" | "submitted" | "approved";
  created_at: string;
  updated_at: string;
};

export type AreaRow = {
  id: string;
  area_number: number;
  election_unit: string;
  area_name: string;
  ward_name: string;
  neighborhoods: string[];
  polling_place: string;
  total_voters: number;
  is_locked: boolean;
};

export async function getPollingAreas(): Promise<AreaRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("polling_areas")
      .select("*")
      .order("area_number", { ascending: true });

    if (error || !data) throw error;

    return (data as any[]).map((item) => ({
      ...item,
      neighborhoods: item.neighborhoods ?? [],
      election_unit: item.election_unit ?? "",
      ward_name: item.ward_name ?? "Phường Ayun Pa",
      is_locked: item.is_locked ?? false
    })) as AreaRow[];
  } catch {
    return mockAreas.map((item) => ({
      id: String(item.id),
      area_number: item.areaNumber,
      election_unit: item.unitName,
      area_name: item.areaName,
      ward_name: item.wardName,
      neighborhoods: item.neighborhoods ?? [],
      polling_place: item.pollingPlace,
      total_voters: item.totalVoters,
      is_locked: false
    }));
  }
}

export async function getLatestProgressRows(): Promise<ProgressRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("progress_reports")
      .select("*")
      .order("report_date", { ascending: false })
      .order("report_hour", { ascending: false });

    if (error || !data) throw error;
    return data as ProgressRow[];
  } catch {
    return [];
  }
}

export async function getDashboardSummary() {
  const areas = await getPollingAreas();
  const progress = await getLatestProgressRows();

  const latestByArea = new Map<string, ProgressRow>();

  for (const row of progress) {
    if (!latestByArea.has(row.polling_area_id)) {
      latestByArea.set(row.polling_area_id, row);
    }
  }

  const mapped = areas.map((area) => {
    const row = latestByArea.get(area.id);
    return {
      ...area,
      neighborhoods: area.neighborhoods ?? [],
      voted_count: row?.voted_count ?? 0,
      status: row?.status ?? "draft",
      updated_at: row?.updated_at ?? null
    };
  });

  const totalWardVoters = mapped.reduce((sum, item) => sum + (item.total_voters ?? 0), 0);
  const totalVoted = mapped.reduce((sum, item) => sum + (item.voted_count ?? 0), 0);
  const reportedAreas = mapped.filter((item) => item.updated_at).length;

  return {
    totalWardVoters: totalWardVoters || kpiSummary.totalWardVoters,
    totalAreas: mapped.length || 11,
    totalVoted,
    turnoutRate: totalWardVoters ? Number(((totalVoted / totalWardVoters) * 100).toFixed(2)) : 0,
    reportedAreas,
    pendingAreas: Math.max((mapped.length || 11) - reportedAreas, 0),
    areas: mapped
  };
}

export async function getCurrentUserRoleCodes(): Promise<string[]> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("user_roles")
      .select("roles(code)")
      .eq("user_id", user.id);

    if (error) throw error;

    return (data ?? [])
      .map((row: any) => row.roles?.code)
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function getScopedAreasForCurrentUser() {
  const allAreas = await getPollingAreas();
  const roles = await getCurrentUserRoleCodes();

  if (
    roles.includes("super_admin") ||
    roles.includes("ward_admin") ||
    roles.includes("viewer")
  ) {
    return allAreas;
  }

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("area_assignments")
      .select("polling_area_id")
      .eq("user_id", user.id);

    if (error) throw error;

    const ids = (data ?? []).map((item: any) => item.polling_area_id);
    return allAreas.filter((area) => ids.includes(area.id));
  } catch {
    return [];
  }
}

export async function getUsersWithAssignments() {
  try {
    const supabase = await createServerSupabase();

    const profilesRes = await supabase.from("profiles").select("id,full_name,phone");
    const userRolesRes = await supabase.from("user_roles").select("user_id,role_id");
    const rolesRes = await supabase.from("roles").select("id,code,name");
    const assignmentsRes = await supabase.from("area_assignments").select("user_id,polling_area_id");

    if (profilesRes.error || userRolesRes.error || rolesRes.error || assignmentsRes.error) {
      console.error("profilesRes.error =", profilesRes.error);
      console.error("userRolesRes.error =", userRolesRes.error);
      console.error("rolesRes.error =", rolesRes.error);
      console.error("assignmentsRes.error =", assignmentsRes.error);
      return [];
    }

    const areas = await getPollingAreas();

    const profiles = profilesRes.data ?? [];
    const userRoles = userRolesRes.data ?? [];
    const roles = rolesRes.data ?? [];
    const assignments = assignmentsRes.data ?? [];

    return profiles.map((profile: any) => {
      const roleNames = userRoles
        .filter((ur: any) => ur.user_id === profile.id)
        .map((ur: any) => roles.find((r: any) => r.id === ur.role_id))
        .filter(Boolean)
        .map((r: any) => r.name ?? r.code);

      const assignedAreas = assignments
        .filter((a: any) => a.user_id === profile.id)
        .map((a: any) => areas.find((area: any) => area.id === a.polling_area_id))
        .filter(Boolean)
        .map((area: any) => `KV ${area.area_number} - ${area.area_name}`);

      return {
        id: profile.id,
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        roles: roleNames,
        assignedAreas
      };
    });
  } catch (error) {
    console.error("getUsersWithAssignments error:", error);
    return [];
  }
}

export async function getProgressSummaryByHour(
  selectedHour?: number | "current"
) {
  const areas = await getPollingAreas();
  const progress = await getLatestProgressRows();

  const effectiveHour =
    selectedHour === undefined || selectedHour === "current"
      ? getCurrentRealHour()
      : selectedHour;

  const latestByArea = new Map<string, ProgressRow>();

  for (const row of progress) {
    const rowHour = Number(row.report_hour);

    if (rowHour > effectiveHour) continue;

    const existing = latestByArea.get(row.polling_area_id);

    if (!existing) {
      latestByArea.set(row.polling_area_id, row);
      continue;
    }

    const existingDateTime = `${existing.report_date} ${existing.report_hour}`;
    const rowDateTime = `${row.report_date} ${row.report_hour}`;

    if (rowDateTime > existingDateTime) {
      latestByArea.set(row.polling_area_id, row);
    }
  }

  const rows = areas.map((area) => {
    const row = latestByArea.get(area.id);
    const voted = row?.voted_count ?? 0;
    const rate =
      area.total_voters > 0
        ? Number(((voted / area.total_voters) * 100).toFixed(2))
        : 0;

    return {
      ...area,
      neighborhoods: area.neighborhoods ?? [],
      voted_count: voted,
      rate,
      updated_at: row?.updated_at ?? null,
      report_hour: row?.report_hour ?? null,
      report_date: row?.report_date ?? null
    };
  });

  const totalVoters = rows.reduce((sum, item) => sum + item.total_voters, 0);
  const totalVoted = rows.reduce((sum, item) => sum + item.voted_count, 0);
  const turnoutRate =
    totalVoters > 0
      ? Number(((totalVoted / totalVoters) * 100).toFixed(2))
      : 0;

  return {
    selectedHour: effectiveHour,
    selectedLabel: formatHourLabel(
      selectedHour === undefined || selectedHour === "current"
        ? "current"
        : selectedHour
    ),
    rows,
    totalVoters,
    totalVoted,
    turnoutRate,
    reportedAreas: rows.filter((r) => r.updated_at).length,
    missingAreas: rows.filter((r) => !r.updated_at)
  };
}

export async function getHourlyOverview() {
  const timePoints: Array<number | "current"> = [
    "current",
    8,
    10.5,
    12,
    14,
    16,
    18,
    20,
    21
  ];

  const items = await Promise.all(
    timePoints.map(async (point) => {
      const summary = await getProgressSummaryByHour(point);
      return {
        time: point,
        label:
          point === "current"
            ? "Hiện tại"
            : point === 10.5
            ? "10h30"
            : formatHourLabel(point),
        totalVoted: summary.totalVoted,
        turnoutRate: summary.turnoutRate,
        reportedAreas: summary.reportedAreas,
        missingAreas: summary.missingAreas.length
      };
    })
  );

  return items;
}
export async function isCurrentUserAdmin() {
  const roles = await getCurrentUserRoleCodes();
  return roles.includes("super_admin") || roles.includes("ward_admin");
}