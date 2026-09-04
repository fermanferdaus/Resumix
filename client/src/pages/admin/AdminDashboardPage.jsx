import { useState, useEffect, useCallback } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { adminApi } from "../../api/adminApi.js";
import { AdminStatCards } from "../../components/admin/AdminStatCards.jsx";
import { AdminOverviewTab } from "../../components/admin/AdminOverviewTab.jsx";
import { AdminUsersTab } from "../../components/admin/AdminUsersTab.jsx";
import { AdminAnomaliesTab } from "../../components/admin/AdminAnomaliesTab.jsx";
import { AdminLogsTab } from "../../components/admin/AdminLogsTab.jsx";
import {
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Users,
  ShieldAlert,
  Globe,
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
        <AdminStatCards stats={stats} isLoading={isLoading} />

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

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <AdminOverviewTab stats={stats} maxTrendVal={maxTrendVal} />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            usersData={usersData}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userRoleFilter={userRoleFilter}
            setUserRoleFilter={setUserRoleFilter}
            usersPage={usersPage}
            setUsersPage={setUsersPage}
            onRevokeSession={handleRevokeSession}
          />
        )}

        {activeTab === "anomalies" && (
          <AdminAnomaliesTab
            anomalies={anomalies}
            users={usersData.items}
            onRevokeSession={handleRevokeSession}
          />
        )}

        {activeTab === "logs" && (
          <AdminLogsTab
            logsData={logsData}
            logSearch={logSearch}
            setLogSearch={setLogSearch}
            logStatusFilter={logStatusFilter}
            setLogStatusFilter={setLogStatusFilter}
            logsPage={logsPage}
            setLogsPage={setLogsPage}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
