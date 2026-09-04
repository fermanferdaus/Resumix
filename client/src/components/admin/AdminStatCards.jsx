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

export const AdminStatCards = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {/* Card 1: Total Pengguna */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Akun Terdaftar
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {isLoading ? "..." : stats?.overview?.totalUsers || 0}
          </span>
          <span className="text-xs text-slate-500">akun</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{stats?.overview?.verifiedUsers || 0} terverifikasi</span>
          <span className="text-slate-300">•</span>
          <span>{stats?.overview?.unverifiedUsers || 0} belum</span>
        </div>
      </div>

      {/* Card 2: Pengguna Sedang Login / Aktif */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Akun Sedang Aktif
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl relative">
            <Activity className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-600">
            {isLoading ? "..." : stats?.overview?.activeUsers || 0}
          </span>
          <span className="text-xs text-slate-500">sesi online</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{stats?.overview?.recentLogins24h || 0} login dalam 24 jam</span>
        </div>
      </div>

      {/* Card 3: Total CV Terbuat */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total CV Dibuat
          </span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {isLoading ? "..." : stats?.overview?.totalResumes || 0}
          </span>
          <span className="text-xs text-slate-500">dokumen CV</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span>Rerata {stats?.overview?.avgResumesPerUser || 0} CV / pengguna</span>
        </div>
      </div>

      {/* Card 4: Anomali Keamanan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Peringatan Anomali
          </span>
          <div
            className={`p-2 rounded-xl ${
              (stats?.overview?.totalAnomalies || 0) > 0
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-3xl font-extrabold ${
              (stats?.overview?.totalAnomalies || 0) > 0
                ? "text-rose-600"
                : "text-slate-900"
            }`}
          >
            {isLoading ? "..." : stats?.overview?.totalAnomalies || 0}
          </span>
          <span className="text-xs text-slate-500">kejadian 24j</span>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>{stats?.overview?.recentFailed24h || 0} login gagal terdeteksi</span>
        </div>
      </div>
    </div>
  );
};

