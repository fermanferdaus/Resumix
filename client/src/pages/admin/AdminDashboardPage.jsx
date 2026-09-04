import { useState, useEffect, useCallback } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { adminApi } from "../../api/adminApi.js";
import {
  Users,
  Activity,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Search,
  RefreshCw,
  LogOut,
  MapPin,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Globe,
  Clock,
  Layers,
  BarChart3,
  ListFilter,
} from "lucide-react";
import toast from "react-hot-toast";

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // State Data
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState({ items: [], meta: { page: 1, totalPages: 1, total: 0 } });
  const [anomalies, setAnomalies] = useState([]);
  const [logsData, setLogsData] = useState({ items: [], meta: { page: 1, totalPages: 1, total: 0 } });

  // State Filters & Pagination
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [usersPage, setUsersPage] = useState(1);

  const [logStatusFilter, setLogStatusFilter] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logsPage, setLogsPage] = useState(1);

  // Load Dashboard Overview Stats & Anomalies
  const fetchOverviewData = useCallback(async () => {
    try {
      const [statsRes, anomaliesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAnomalies(),
      ]);
      if (statsRes?.data) setStats(statsRes.data);
      if (anomaliesRes?.data) setAnomalies(anomaliesRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat statistik admin");
    }
  }, []);

  // Load Users List
  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminApi.getUsers({
        page: usersPage,
        limit: 10,
        search: userSearch,
        role: userRoleFilter,
      });
      if (res?.data) {
        setUsersData({
          items: res.data,
          meta: res.meta || { page: 1, totalPages: 1, total: res.data.length },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data pengguna");
    }
  }, [usersPage, userSearch, userRoleFilter]);

  // Load Login Logs
  const fetchLogs = useCallback(async () => {
    try {
      const res = await adminApi.getLogs({
        page: logsPage,
        limit: 15,
        status: logStatusFilter,
        search: logSearch,
      });
      if (res?.data) {
        setLogsData({
          items: res.data,
          meta: res.meta || { page: 1, totalPages: 1, total: res.data.length },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat log aktivitas");
    }
  }, [logsPage, logStatusFilter, logSearch]);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchOverviewData(), fetchUsers(), fetchLogs()]);
      setIsLoading(false);
    };
    init();
  }, [fetchOverviewData, fetchUsers, fetchLogs]);

  // Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOverviewData(), fetchUsers(), fetchLogs()]);
    setIsRefreshing(false);
    toast.success("Data monitoring berhasil diperbarui");
  };

  // Revoke User Sessions Action
  const handleRevokeSession = async (userPublicId, userEmail) => {
    if (!window.confirm(`Yakin ingin memutuskan seluruh sesi aktif milik ${userEmail}? Pengguna akan dipaksa logout.`)) {
      return;
    }
    try {
      const res = await adminApi.revokeUserSessions(userPublicId);
      toast.success(res.message || "Sesi pengguna berhasil diputuskan");
      fetchUsers();
      fetchOverviewData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memutuskan sesi");
    }
  };

  // Kalkulasi Maksimum Tren untuk Skala Grafik SVG
  const maxTrendVal = Math.max(
    ...(stats?.trends || []).map((t) => Math.max(t.logins || 0, t.registrations || 0, t.failed || 0)),
    5
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Dashboard Admin */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Pusat Kendali
              </span>
              <span className="text-xs text-slate-500">• Pemantauan Real-Time</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Dashboard Monitoring Sistem
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pantau status login, populasi akun terdaftar, kuota CV per pengguna, dan deteksi anomali keamanan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              Segarkan Data
            </button>
          </div>
        </div>

        {/* 4 Kartu Metrik Utama */}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Ringkasan & Visual Grafik
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4" />
            Pengguna & Kuota CV
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-800">
              {stats?.overview?.totalUsers || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("anomalies")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === "anomalies"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Monitoring Anomali
            {anomalies.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                {anomalies.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
              activeTab === "logs"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Globe className="w-4 h-4" />
            Log Aktivitas & Geolokasi
          </button>
        </div>

        {/* TAB 1: RINGKASAN & VISUAL GRAFIK */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Grafik Tren 7 Hari Terakhir */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Aktivitas Sistem 7 Hari Terakhir
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perbandingan pendaftaran akun baru, login berhasil, dan percobaan gagal.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Login Sukses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Registrasi Baru</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span>Login Gagal</span>
                  </div>
                </div>
              </div>

              {/* Visualisasi Bar Chart SVG Dinamis */}
              <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2 border-b border-slate-100">
                {stats?.trends?.map((item, idx) => {
                  const loginH = Math.min(100, Math.round(((item.logins || 0) / maxTrendVal) * 100));
                  const regH = Math.min(100, Math.round(((item.registrations || 0) / maxTrendVal) * 100));
                  const failH = Math.min(100, Math.round(((item.failed || 0) / maxTrendVal) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="flex items-end gap-1.5 w-full justify-center h-48">
                        {/* Bar Login Sukses */}
                        <div
                          style={{ height: `${Math.max(loginH, 4)}%` }}
                          title={`Login Sukses: ${item.logins}`}
                          className="w-3 sm:w-4 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all"
                        />
                        {/* Bar Registrasi Baru */}
                        <div
                          style={{ height: `${Math.max(regH, 4)}%` }}
                          title={`Registrasi Baru: ${item.registrations}`}
                          className="w-3 sm:w-4 bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all"
                        />
                        {/* Bar Login Gagal */}
                        <div
                          style={{ height: `${Math.max(failH, 4)}%` }}
                          title={`Login Gagal: ${item.failed}`}
                          className="w-3 sm:w-4 bg-rose-400 rounded-t-md hover:bg-rose-500 transition-all"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 tracking-tight text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid 2 Kolom: Perangkat & Kesehatan Sistem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribusi Perangkat Login */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Distribusi Perangkat Pengguna
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Platform yang digunakan pengguna saat mengakses aplikasi.
                </p>

                <div className="space-y-4">
                  {(() => {
                    const d = stats?.devices || { desktop: 0, mobile: 0, tablet: 0 };
                    const totalDev = (d.desktop || 0) + (d.mobile || 0) + (d.tablet || 0) || 1;
                    const pctDesktop = Math.round(((d.desktop || 0) / totalDev) * 100);
                    const pctMobile = Math.round(((d.mobile || 0) / totalDev) * 100);
                    const pctTablet = Math.round(((d.tablet || 0) / totalDev) * 100);

                    return (
                      <>
                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <Laptop className="w-4 h-4 text-blue-600" /> Desktop
                            </span>
                            <span>{d.desktop || 0} ({pctDesktop}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div style={{ width: `${pctDesktop}%` }} className="h-full bg-blue-600 rounded-full" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <Smartphone className="w-4 h-4 text-emerald-600" /> Smartphone
                            </span>
                            <span>{d.mobile || 0} ({pctMobile}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div style={{ width: `${pctMobile}%` }} className="h-full bg-emerald-500 rounded-full" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                            <span className="flex items-center gap-1.5">
                              <Tablet className="w-4 h-4 text-purple-600" /> Tablet
                            </span>
                            <span>{d.tablet || 0} ({pctTablet}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div style={{ width: `${pctTablet}%` }} className="h-full bg-purple-500 rounded-full" />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Status Sistem & Database */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Integritas & Kesehatan Infrastruktur
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Status koneksi database, port reverse proxy, dan sanitasi sesi.
                </p>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Database PostgreSQL 15
                    </span>
                    <span className="px-2 py-0.5 font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                      Terhubung (Healthy)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" /> Rate Limiter Khusus Admin
                    </span>
                    <span className="px-2 py-0.5 font-semibold bg-blue-100 text-blue-800 rounded-md">
                      60 req / 5 min
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" /> Resolusi Geolokasi IP
                    </span>
                    <span className="px-2 py-0.5 font-semibold bg-indigo-100 text-indigo-800 rounded-md">
                      Offline (geoip-lite)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGGUNA & KUOTA CV */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter & Search Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama pengguna, email, atau domisili..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUsersPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Peran:</span>
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value);
                    setUsersPage(1);
                  }}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Semua Peran</option>
                  <option value="ADMIN">Hanya Admin</option>
                  <option value="USER">Pengguna Biasa</option>
                </select>
              </div>
            </div>

            {/* Tabel Pengguna */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Nama Pengguna & Email</th>
                    <th className="py-3 px-4">Peran</th>
                    <th className="py-3 px-4">Jumlah CV (Kuota)</th>
                    <th className="py-3 px-4">Sesi Online</th>
                    <th className="py-3 px-4">Login Terakhir</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Aksi Kelola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {usersData.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    usersData.items.map((u) => {
                      const cvCount = u.resumesCount || 0;
                      const isFullQuota = cvCount >= 5;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Nama Pengguna & Email */}
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              {u.avatarUrl ? (
                                <img
                                  src={u.avatarUrl}
                                  alt={u.fullName}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                                  {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                                  {u.fullName}
                                  {u.isVerified ? (
                                    <span title="Email Terverifikasi">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    </span>
                                  ) : (
                                    <span title="Belum Verifikasi">
                                      <XCircle className="w-3.5 h-3.5 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-500 text-[11px]">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Peran (Role) */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                                u.role === "ADMIN"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          {/* Jumlah CV yang sudah dibuat */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-xs ${
                                  isFullQuota ? "text-amber-600" : "text-slate-900"
                                }`}
                              >
                                {cvCount} / 5 CV
                              </span>
                              <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${(cvCount / 5) * 100}%` }}
                                  className={`h-full rounded-full ${
                                    isFullQuota ? "bg-amber-500" : "bg-blue-500"
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Sesi Online */}
                          <td className="py-3.5 px-4">
                            {u.activeSessionsCount > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {u.activeSessionsCount} sesi aktif
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Offline</span>
                            )}
                          </td>

                          {/* Login Terakhir & Lokasi */}
                          <td className="py-3.5 px-4">
                            {u.lastLogin ? (
                              <div>
                                <div className="text-[11px] text-slate-700 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{u.lastLogin.location}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {new Date(u.lastLogin.timestamp).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Aksi Kelola */}
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            {u.activeSessionsCount > 0 ? (
                              <button
                                onClick={() => handleRevokeSession(u.id, u.email)}
                                title="Paksa logout seluruh sesi akun ini"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                              >
                                <LogOut className="w-3 h-3" />
                                Putuskan Sesi
                              </button>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Sesi Bersih</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {usersData.meta.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Menampilkan halaman <strong>{usersData.meta.page}</strong> dari{" "}
                  <strong>{usersData.meta.totalPages}</strong> (Total {usersData.meta.total} pengguna)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={usersPage <= 1}
                    onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={usersPage >= usersData.meta.totalPages}
                    onClick={() => setUsersPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MONITORING ANOMALI KEAMANAN */}
        {activeTab === "anomalies" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                Pusat Deteksi Anomali & Pembobolan
              </h3>
              <p className="text-xs text-slate-500">
                Sistem secara cerdas memantau lonjakan kegagalan password, serangan brute-force, dan penggunaan token tidak sah.
              </p>
            </div>

            {anomalies.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900">Sistem Berjalan Aman</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Tidak terdeteksi aktivitas anomali atau upaya brute-force dalam 24 jam terakhir.
                </p>
              </div>
            ) : (
              anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className={`p-5 rounded-2xl border shadow-sm transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    anom.severity === "CRITICAL"
                      ? "border-rose-300 bg-rose-50/20"
                      : anom.severity === "WARNING"
                      ? "border-amber-300 bg-amber-50/20"
                      : "border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        anom.severity === "CRITICAL"
                          ? "bg-rose-100 text-rose-700"
                          : anom.severity === "WARNING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            anom.severity === "CRITICAL"
                              ? "bg-rose-600 text-white"
                              : anom.severity === "WARNING"
                              ? "bg-amber-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {anom.severity}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(anom.timestamp).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{anom.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{anom.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span>Target: <strong>{anom.target}</strong></span>
                        {anom.ipAddress !== "-" && <span>IP: <code>{anom.ipAddress}</code></span>}
                        <span>Lokasi: {anom.location}</span>
                      </div>
                    </div>
                  </div>

                  {anom.target?.includes("@") && (
                    <button
                      onClick={() => {
                        const targetUser = usersData.items.find((u) => u.email === anom.target);
                        if (targetUser) {
                          handleRevokeSession(targetUser.id, targetUser.email);
                        } else {
                          toast.error("User ID tidak ditemukan dalam daftar aktif");
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors self-start sm:self-center shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Cabut Sesi Akun
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: LOG AKTIVITAS & GEOLOKASI */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari IP, email, kota, negara..."
                  value={logSearch}
                  onChange={(e) => {
                    setLogSearch(e.target.value);
                    setLogsPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={logStatusFilter}
                  onChange={(e) => {
                    setLogStatusFilter(e.target.value);
                    setLogsPage(1);
                  }}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none"
                >
                  <option value="">Semua Status</option>
                  <option value="SUCCESS">Hanya Berhasil</option>
                  <option value="FAILED">Hanya Gagal</option>
                </select>
              </div>
            </div>

            {/* Tabel Log */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Waktu Kejadian</th>
                    <th className="py-3 px-4">Pengguna / Email</th>
                    <th className="py-3 px-4">Alamat IP</th>
                    <th className="py-3 px-4">Geolokasi Terdeteksi</th>
                    <th className="py-3 px-4">Perangkat & Browser</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Status & Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {logsData.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada catatan log aktivitas yang tersedia.
                      </td>
                    </tr>
                  ) : (
                    logsData.items.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 sm:px-6 font-mono text-[11px] text-slate-500">
                          {new Date(log.createdAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{log.userName}</div>
                          <div className="text-[11px] text-slate-500">{log.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                          {log.ipAddress}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{log.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            {log.device === "Mobile" ? (
                              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{log.browser || "Unknown"} ({log.device})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                log.status === "SUCCESS"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {log.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              via {log.loginMethod}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {logsData.meta.totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  Halaman <strong>{logsData.meta.page}</strong> dari{" "}
                  <strong>{logsData.meta.totalPages}</strong> (Total {logsData.meta.total} log)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={logsPage <= 1}
                    onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={logsPage >= logsData.meta.totalPages}
                    onClick={() => setLogsPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
