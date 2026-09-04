import {
  Users,
  UserCheck,
  Activity,
  Clock,
  FileText,
  Layers,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";

export const AdminStatCards = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-4 sm:my-6">
      {/* Card 1: Total Pengguna */}
      <Card className="hover:border-[#1a1c1e] transition-colors rounded-none">
        <CardHeader className="p-3 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] sm:text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Pengguna
          </CardTitle>
          <div className="p-1.5 sm:p-2 bg-[#fef2f2] text-[#af101a] border border-[#fecaca]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] font-mono-code">
              {isLoading ? "..." : stats?.overview?.totalUsers || 0}
            </span>
            <span className="text-[11px] sm:text-xs text-[#5d5e61]">akun</span>
          </div>
          <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#5d5e61] flex items-center gap-1 sm:gap-1.5 truncate">
            <UserCheck className="w-3 h-3 text-[#16a34a] shrink-0" />
            <span className="truncate">{stats?.overview?.verifiedUsers || 0} aktif</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Pengguna Sedang Login / Aktif */}
      <Card className="hover:border-[#1a1c1e] transition-colors rounded-none">
        <CardHeader className="p-3 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] sm:text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Sesi Online
          </CardTitle>
          <div className="p-1.5 sm:p-2 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] relative">
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#16a34a] animate-ping" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#065f46] font-mono-code">
              {isLoading ? "..." : stats?.overview?.activeUsers || 0}
            </span>
            <span className="text-[11px] sm:text-xs text-[#5d5e61]">sesi</span>
          </div>
          <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#5d5e61] flex items-center gap-1 sm:gap-1.5 truncate">
            <Clock className="w-3 h-3 text-[#5d5e61] shrink-0" />
            <span className="truncate">{stats?.overview?.recentLogins24h || 0} login 24j</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Total CV */}
      <Card className="hover:border-[#1a1c1e] transition-colors rounded-none">
        <CardHeader className="p-3 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] sm:text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Total CV
          </CardTitle>
          <div className="p-1.5 sm:p-2 bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0]">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] font-mono-code">
              {isLoading ? "..." : stats?.overview?.totalResumes || 0}
            </span>
            <span className="text-[11px] sm:text-xs text-[#5d5e61]">file</span>
          </div>
          <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#5d5e61] flex items-center gap-1 sm:gap-1.5 truncate">
            <Layers className="w-3 h-3 text-[#af101a] shrink-0" />
            <span className="truncate">Rerata {stats?.overview?.avgResumesPerUser || 0}/user</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Anomali Keamanan */}
      <Card className="hover:border-[#1a1c1e] transition-colors rounded-none">
        <CardHeader className="p-3 sm:p-5 pb-1 sm:pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-[11px] sm:text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Anomali
          </CardTitle>
          <div
            className={`p-1.5 sm:p-2 border ${
              (stats?.overview?.totalAnomalies || 0) > 0
                ? "bg-[#fef2f2] text-[#af101a] border-[#fecaca]"
                : "bg-[#f8fafc] text-[#5d5e61] border-[#e2e8f0]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-5 pt-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono-code ${
                (stats?.overview?.totalAnomalies || 0) > 0
                  ? "text-[#ba1a1a]"
                  : "text-[#0f172a]"
              }`}
            >
              {isLoading ? "..." : stats?.overview?.totalAnomalies || 0}
            </span>
            <span className="text-[11px] sm:text-xs text-[#5d5e61]">insiden</span>
          </div>
          <div className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-[#5d5e61] flex items-center gap-1 sm:gap-1.5 truncate">
            <AlertTriangle className="w-3 h-3 text-[#d97706] shrink-0" />
            <span className="truncate">{stats?.overview?.recentFailed24h || 0} gagal 24j</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
