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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* Card 1: Total Pengguna */}
      <Card className="hover:border-[#1a1c1e] transition-colors">
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Total Akun Terdaftar
          </CardTitle>
          <div className="p-2 bg-[#fef2f2] text-[#af101a] border border-[#fecaca]">
            <Users className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0f172a] font-mono-code">
              {isLoading ? "..." : stats?.overview?.totalUsers || 0}
            </span>
            <span className="text-xs text-[#5d5e61]">akun</span>
          </div>
          <div className="mt-2 text-xs text-[#5d5e61] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>{stats?.overview?.verifiedUsers || 0} terverifikasi</span>
            <span className="text-[#cbd5e1]">•</span>
            <span>{stats?.overview?.unverifiedUsers || 0} belum</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Pengguna Sedang Login / Aktif */}
      <Card className="hover:border-[#1a1c1e] transition-colors">
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Akun Sedang Aktif
          </CardTitle>
          <div className="p-2 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] relative">
            <Activity className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#16a34a] animate-ping" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#065f46] font-mono-code">
              {isLoading ? "..." : stats?.overview?.activeUsers || 0}
            </span>
            <span className="text-xs text-[#5d5e61]">sesi online</span>
          </div>
          <div className="mt-2 text-xs text-[#5d5e61] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5d5e61]" />
            <span>{stats?.overview?.recentLogins24h || 0} login dalam 24 jam</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Total CV Terbuat */}
      <Card className="hover:border-[#1a1c1e] transition-colors">
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Total CV Dibuat
          </CardTitle>
          <div className="p-2 bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0]">
            <FileText className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#0f172a] font-mono-code">
              {isLoading ? "..." : stats?.overview?.totalResumes || 0}
            </span>
            <span className="text-xs text-[#5d5e61]">dokumen CV</span>
          </div>
          <div className="mt-2 text-xs text-[#5d5e61] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#af101a]" />
            <span>Rerata {stats?.overview?.avgResumesPerUser || 0} CV / pengguna</span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Anomali Keamanan */}
      <Card className="hover:border-[#1a1c1e] transition-colors">
        <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-bold text-[#5d5e61] uppercase tracking-wider">
            Peringatan Anomali
          </CardTitle>
          <div
            className={`p-2 border ${
              (stats?.overview?.totalAnomalies || 0) > 0
                ? "bg-[#fef2f2] text-[#af101a] border-[#fecaca]"
                : "bg-[#f8fafc] text-[#5d5e61] border-[#e2e8f0]"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-1">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono-code ${
                (stats?.overview?.totalAnomalies || 0) > 0
                  ? "text-[#ba1a1a]"
                  : "text-[#0f172a]"
              }`}
            >
              {isLoading ? "..." : stats?.overview?.totalAnomalies || 0}
            </span>
            <span className="text-xs text-[#5d5e61]">kejadian 24j</span>
          </div>
          <div className="mt-2 text-xs text-[#5d5e61] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{stats?.overview?.recentFailed24h || 0} login gagal terdeteksi</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
